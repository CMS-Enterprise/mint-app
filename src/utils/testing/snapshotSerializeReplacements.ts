/* 
Util for renaming nests component attributes in Jest snapshots using enzyme-to-json

https://www.npmjs.com/package/enzyme-to-json

Replaces the id and aria-described by on Truss <Tooltip /> component
Truss's <Tooltip /> generates unique attributes and errors out any snapshot with the component


Example: 
https://github.com/adriantoine/enzyme-to-json/blob/HEAD/docs/map.md

expect(
    toJSON(component, {
    mode: 'deep',
    map: renameTooltipAriaAndID as OutputMapper
    })
).toMatchSnapshot();
*/

const renameTooltipAriaAndID = (json: any) => {
  if (json.type === 'div' && json.props['data-testid'] === 'triggerElement') {
    return {
      ...json,
      props: {
        ...json.props,
        'aria-describedby': 'tooltip',
        id: 'mint-tooltip'
      }
    };
  }
  if (json.type === 'span' && json.props['data-testid'] === 'tooltipBody') {
    return {
      ...json,
      props: {
        ...json.props,
        'aria-describedby': 'mint-tooltip',
        id: 'mint-tooltip-body'
      }
    };
  }
  return json;
};

export default renameTooltipAriaAndID;
