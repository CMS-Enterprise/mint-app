#!/bin/bash

# Script to update all <form /> tags under <Formik /> components to use MINTForm
# This script will systematically update the codebase to use the new MINTForm component

echo "Starting form tag updates to MINTForm..."

# Function to update a single file
update_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "Updating $file..."
    
    # Add MINTForm import if not already present
    if ! grep -q "import MINTForm from 'components/MINTForm'" "$file"; then
        # Find the line with Formik import and add MINTForm import after it
        sed -i.tmp '/import.*Formik.*from.*formik/a\
import MINTForm from '\''components/MINTForm'\'';' "$file"
    fi
    
    # Replace opening form tags with MINTForm (handle both cases)
    sed -i.tmp 's/<form\([^>]*\)>/<MINTForm\1>/g' "$file"
    
    # Replace closing form tags with MINTForm
    sed -i.tmp 's/<\/form>/<\/MINTForm>/g' "$file"
    
    # Remove temporary file
    rm "$temp_file"
    
    echo "✓ Updated $file"
}

# List of files that need to be updated (based on grep search results)
files_to_update=(
    "src/features/ModelPlan/TaskList/GeneralCharacteristics/Involvements/index.tsx"
    "src/features/ModelPlan/TaskList/GeneralCharacteristics/KeyCharacteristics/index.tsx"
    "src/features/ModelPlan/TaskList/GeneralCharacteristics/ModelRelation/index.tsx"
    "src/features/ModelPlan/TaskList/GeneralCharacteristics/Authority/index.tsx"
    "src/features/ModelPlan/TaskList/Basics/Overview/index.tsx"
    "src/features/ModelPlan/TaskList/Basics/BasicsInfo/index.tsx"
    "src/features/ModelPlan/TaskList/Beneficiaries/BeneficiaryIdentification/index.tsx"
    "src/features/ModelPlan/TaskList/Beneficiaries/Frequency/index.tsx"
    "src/features/ModelPlan/TaskList/Beneficiaries/PeopleImpact/index.tsx"
    "src/features/ModelPlan/TaskList/ParticipantsAndProviders/Participants/index.tsx"
    "src/features/ModelPlan/TaskList/ParticipantsAndProviders/ProviderOptions/index.tsx"
    "src/features/ModelPlan/TaskList/ParticipantsAndProviders/ParticipantOptions/index.tsx"
    "src/features/ModelPlan/TaskList/ParticipantsAndProviders/Communication/index.tsx"
    "src/features/ModelPlan/TaskList/ParticipantsAndProviders/Coordination/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/FundingSource/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/Recover/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/Complexity/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/ClaimsBasedPayment/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/AnticipateDependencies/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/NonClaimsBasedPayment/index.tsx"
    "src/features/ModelPlan/TaskList/Payment/BeneficiaryCostSharing/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/IDDOC/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/Performance/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/Support/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/Evaluation/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/Learning/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/DataSharing/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/CCWAndQuality/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/IDDOCTesting/index.tsx"
    "src/features/ModelPlan/TaskList/OpsEvalAndLearning/IDDOCMonitoring/index.tsx"
    "src/features/ModelPlan/TaskList/PrepareForClearance/Checklist/index.tsx"
    "src/features/ModelPlan/Status/index.tsx"
    "src/features/ModelPlan/NewPlan/index.tsx"
    "src/features/ModelPlan/Timeline/index.tsx"
    "src/features/ModelPlan/Documents/AddDocument/LinkDocument.tsx"
    "src/features/ModelPlan/Documents/AddDocument/documentUpload.tsx"
    "src/features/ModelPlan/Discussions/QuestionAndReply.tsx"
    "src/features/Notifications/Settings/index.tsx"
    "src/features/Home/Settings/selectSolutions.tsx"
    "src/features/Home/Settings/settings.tsx"
    "src/features/Feedback/ReportAProblem/index.tsx"
    "src/features/Feedback/SendFeedback/index.tsx"
    "src/features/NDA/index.tsx"
)

# Update each file
for file in "${files_to_update[@]}"; do
    if [ -f "$file" ]; then
        update_file "$file"
    else
        echo "⚠ File not found: $file"
    fi
done

echo ""
echo "Form tag updates completed!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run lint:fix' to fix any formatting issues"
echo "2. Run 'npm run build:ts' to check for TypeScript errors"
echo "3. Test the application to ensure forms still work correctly"
echo ""
echo "Note: Some files may need manual review if they have complex form structures"
