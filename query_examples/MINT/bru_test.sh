#!/usr/bin/env bash
set -euo pipefail

# ------- Paths (from Bruno collection root) -------
CREATE_MODEL_PLAN_BRU='Model Plan/Create Model Plan.bru'
CREATE_MILESTONE_BRU='Models to Operations Matrix/Milestones/NewMTOMilestone (Custom).bru'
CREATE_SOLUTION_BRU='Models to Operations Matrix/Solutions/NewMTOSolution (Custom).bru'
LINK_MS_SOL_BRU='Models to Operations Matrix/Milestones/UpdateMTOMilestoneLinkedSolutions.bru'
DELETE_MILESTONE_BRU='Models to Operations Matrix/Milestones/DeleteMTOMilestone.bru'

# Ensure we're at collection root
if [[ ! -f "bruno.json" && ! -f "collection.bru" ]]; then
  echo "❌ Run from the Bruno collection root (folder with bruno.json or collection.bru)"; exit 1
fi

TMP_DIR="$(mktemp -d)"
OUT1="$TMP_DIR/01_create_model_plan.json"
OUT2="$TMP_DIR/02_create_milestone.json"
OUT3="$TMP_DIR/03_create_solution.json"
OUT4="$TMP_DIR/04_link_ms_sol.json"
OUT5="$TMP_DIR/05_delete_milestone.json"

run_and_report () { bru run "$1" --output "$2" >/dev/null; }
first_resp () { jq -c '.. | objects | select(has("response")) | .response' "$1" | head -n1; }
duration_ms () { jq -r '.[0].results[0].response.responseTime' "$1"; }

get_mp_id () {
  jq -r '.data.data.createModelPlan.id // empty' <<<"$1"
}
get_ms_id () {
  jq -r '.data.data.createMTOMilestoneCustom.id // .data.data.createMTOMilestone.id // empty' <<<"$1"
}
get_sol_id () {
  jq -r '.data.data.createMTOSolutionCustom.id // .data.data.createMTOSolution.id // empty' <<<"$1"
}

# 1) Create Model Plan
echo "🚀 Create Model Plan..."
run_and_report "$CREATE_MODEL_PLAN_BRU" "$OUT1"
RESP1="$(first_resp "$OUT1")"
MODEL_PLAN_ID="$(get_mp_id "$RESP1")"
DUR1="$(duration_ms "$OUT1")"
echo "✅ modelPlanID = ${MODEL_PLAN_ID:-null}  (${DUR1}ms)"
if [[ -z "${MODEL_PLAN_ID:-}" ]]; then
  echo "❌ No modelPlanID found. Raw body:"; echo "$RESP1" | jq .
  exit 1
fi

# 2) Create Milestone (pass modelPlanID)
echo "🚀 Create MTO Milestone (Custom)..."
bru run "$CREATE_MILESTONE_BRU" --env-var "modelPlanID=$MODEL_PLAN_ID" --output "$OUT2" >/dev/null
RESP2="$(first_resp "$OUT2")"
MILESTONE_ID="$(get_ms_id "$RESP2")"
DUR2="$(duration_ms "$OUT2")"
echo "✅ mtoMilestoneID = ${MILESTONE_ID:-null}  (${DUR2}ms)"
if [[ -z "${MILESTONE_ID:-}" ]]; then
  echo "⚠️  Milestone create returned no id. Response:"; echo "$RESP2" | jq .
  # continue if you want, or exit 1
fi

# 3) Create Solution (pass modelPlanID)
echo "🚀 Create MTO Solution (Custom)..."
bru run "$CREATE_SOLUTION_BRU" --env-var "modelPlanID=$MODEL_PLAN_ID" --output "$OUT3" >/dev/null
RESP3="$(first_resp "$OUT3")"
SOLUTION_ID="$(get_sol_id "$RESP3")"
DUR3="$(duration_ms "$OUT3")"
echo "✅ mtoSolutionID = ${SOLUTION_ID:-null}  (${DUR3}ms)"
if [[ -z "${SOLUTION_ID:-}" ]]; then
  echo "⚠️  Solution create returned no id. Response:"; echo "$RESP3" | jq .
fi

# 4) Link Solution → Milestone
echo "🔗 Link solution → milestone..."
bru run "$LINK_MS_SOL_BRU" \
  --env-var "modelPlanID=$MODEL_PLAN_ID" \
  --env-var "mtoMilestoneID=${MILESTONE_ID:-}" \
  --env-var "mtoSolutionID=${SOLUTION_ID:-}" \
  --output "$OUT4" >/dev/null
DUR4="$(duration_ms "$OUT4")"

# 5) Delete Milestone
echo "🗑️  Delete milestone..."
bru run "$DELETE_MILESTONE_BRU" --env-var "mtoMilestoneID=${MILESTONE_ID:-}" \
  --output "$OUT5" >/dev/null
DUR5="$(duration_ms "$OUT5")"

# ------- Aggregate summary across all five runs -------
AGG_JSON="$TMP_DIR/agg.json"
jq -s '.' "$OUT1" "$OUT2" "$OUT3" "$OUT4" "$OUT5" > "$AGG_JSON"

# Note: each file is an array; aggregate with [][]
TOTAL_REQ="$(jq '[.[].[] | .summary.totalRequests] | add' "$AGG_JSON")"
PASSED_REQ="$(jq '[.[].[] | .summary.passedRequests] | add' "$AGG_JSON")"
FAILED_REQ="$(jq '[.[].[] | .summary.failedRequests] | add' "$AGG_JSON")"
ERROR_REQ="$(jq '[.[].[] | .summary.errorRequests]  | add' "$AGG_JSON")"
TOTAL_ASSERTS="$(jq '[.[].[] | .summary.totalAssertions] | add' "$AGG_JSON")"
PASSED_ASSERTS="$(jq '[.[].[] | .summary.passedAssertions] | add' "$AGG_JSON")"
FAILED_ASSERTS="$(jq '[.[].[] | .summary.failedAssertions] | add' "$AGG_JSON")"
TOTAL_TESTS="$(jq '[.[].[] | .summary.totalTests] | add' "$AGG_JSON")"
PASSED_TESTS="$(jq '[.[].[] | .summary.passedTests] | add' "$AGG_JSON")"
FAILED_TESTS="$(jq '[.[].[] | .summary.failedTests] | add' "$AGG_JSON")"

# ------- Pretty table (dynamic width) -------
strip_ansi() { printf '%s' "$1" | sed -E 's/\x1B\[[0-9;]*m//g'; }
disp_len() { strip_ansi "$1" | wc -m | tr -d ' '; }   # no trailing newline fed in

padline() { printf "%${1}s" "" | tr ' ' '─'; }

STATUS="$([[ $FAILED_REQ -eq 0 && $ERROR_REQ -eq 0 ]] && echo '✓ PASS' || echo '✗ FAIL')"
REQS="$TOTAL_REQ ($PASSED_REQ Passed, $FAILED_REQ Failed, $ERROR_REQ Error)"
TESTS="$TOTAL_TESTS ($PASSED_TESTS Passed, $FAILED_TESTS Failed)"
ASSERTS="$TOTAL_ASSERTS ($PASSED_ASSERTS Passed, $FAILED_ASSERTS Failed)"
DURS="${DUR1}ms/${DUR2}ms/${DUR3}ms/${DUR4}ms/${DUR5}ms"

LEFT_W=20
RIGHT_W=0
for s in "$STATUS" "$REQS" "$TESTS" "$ASSERTS" "$DURS"; do
  l=$(disp_len "$s"); (( l > RIGHT_W )) && RIGHT_W=$l
done

TOP="┌$(padline $((LEFT_W+2)))┬$(padline $((RIGHT_W+2)))┐"
MID="├$(padline $((LEFT_W+2)))┼$(padline $((RIGHT_W+2)))┤"
BOT="└$(padline $((LEFT_W+2)))┴$(padline $((RIGHT_W+2)))┘"

print_row() {
  local left="$1" right="$2"
  local rl pad
  rl=$(disp_len "$right")
  pad=$(( RIGHT_W - rl ))
  (( pad < 0 )) && pad=0           # never negative (safety if glyph width is odd)
  printf "│ %-${LEFT_W}s │ %s%*s │\n" "$left" "$right" "$pad" ""
}

echo
echo "📊 Combined Execution Summary"
echo "$TOP"
print_row "Status"      "$STATUS"
echo "$MID"
print_row "Requests"    "$REQS"
echo "$MID"
print_row "Tests"       "$TESTS"
echo "$MID"
print_row "Assertions"  "$ASSERTS"
echo "$MID"
print_row "Step Durations" "$DURS"
echo "$BOT"

echo "🎉 Done."
