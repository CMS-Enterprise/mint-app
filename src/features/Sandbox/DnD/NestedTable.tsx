import React, { useState } from 'react';

import DraggableRow from './DraggableRow';

const NestedTable = ({ rawData }: any) => {
  const [data, setData] = useState(rawData);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [subExpandedRows, setSubExpandedRows] = useState<string[]>([]);

  // Function to toggle row expansion
  const toggleRow = (index: string) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Function to toggle sub-row expansion
  const toggleSubRow = (index: string) => {
    setSubExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const moveRow = (dragIndex, hoverIndex, type, subID, milestoneID) => {
    // Clone the existing data
    const updatedData = [...data];

    console.log(dragIndex, hoverIndex, subID, milestoneID);

    if (type === 'category') {
      //   console.log('category');
      // Handle Category reordering
      const [draggedCategory] = updatedData.splice(dragIndex, 1);
      updatedData.splice(hoverIndex, 0, draggedCategory);
    } else if (type === 'subcategory') {
      //   console.log('subcategory');
      // Find the category that contains the dragged subcategory
      const parentCategory = updatedData.find(cat =>
        cat.subCategories.some(sub => sub.id === subID)
      );

      if (parentCategory) {
        // Find the subcategories array and reorder within it
        const subCategories = [...parentCategory.subCategories];
        const draggedSub = subCategories.splice(dragIndex, 1)[0];
        subCategories.splice(hoverIndex, 0, draggedSub);

        // Replace the modified subcategories array back to the parent category
        parentCategory.subCategories = subCategories;
      }
    } else if (type === 'milestone') {
      //   console.log('milestone');
      // Find the parent sub-category
      const parentCategory = updatedData.find(cat =>
        cat.subCategories.some(sub =>
          sub.milestones.some(milestone => milestone.id === subID)
        )
      );

      const parentSubCategory = parentCategory?.subCategories.find(sub =>
        sub.milestones.some(milestone => milestone.id === milestoneID)
      );

      if (parentSubCategory) {
        // Reorder milestones within the found sub-category
        const milestones = [...parentSubCategory.milestones];
        const draggedMilestone = milestones.splice(dragIndex, 1)[0];
        milestones.splice(hoverIndex, 0, draggedMilestone);

        // Update the sub-category with reordered milestones
        parentSubCategory.milestones = milestones;
      }
    }

    // Set the new data state
    setData(updatedData);
  };

  const renderMilestones = (milestones, categoryID, subID) =>
    milestones.map((milestone, index) => (
      <DraggableRow
        key={milestone.id}
        index={index}
        type="milestone"
        moveRow={(dragIndex, hoverIndex) =>
          moveRow(dragIndex, hoverIndex, 'milestone', subID, milestone.id)
        }
        id={milestone.id}
      >
        <td className="padding-2 padding-left-0">{milestone.name}</td>
        <td className="padding-2 padding-left-0">{milestone.facilitatedBy}</td>
        <td className="padding-2 padding-left-0">
          {milestone.solutions.join(', ')}
        </td>
        <td className="padding-2 padding-left-0">{milestone.needBy}</td>
        <td className="padding-2 padding-left-0">{milestone.status}</td>
        <td className="padding-2 padding-left-0">{milestone.actions}</td>
      </DraggableRow>
    ));

  const renderSubCategories = (subCategories, categoryID) =>
    subCategories.map((sub, index) => {
      const isExpanded = subExpandedRows.includes(sub.id!);

      return (
        <div style={{ display: 'contents' }}>
          <DraggableRow
            index={index}
            type="subcategory"
            moveRow={(dragIndex, hoverIndex) =>
              moveRow(dragIndex, hoverIndex, 'subcategory', sub.id)
            }
            id={sub.id}
            toggleRow={toggleSubRow}
            style={{
              backgroundColor: '#F0F0F0',
              fontWeight: 'bold',
              borderBottom: '1px solid black',
              cursor: 'pointer'
            }}
          >
            <td colSpan={6} className="padding-2 padding-left-0">
              {sub.name}
            </td>
          </DraggableRow>
          {isExpanded && renderMilestones(sub.milestones, categoryID, sub.id)}
        </div>
      );
    });

  const renderCategories = () =>
    data.map((category, index) => {
      const isExpanded = expandedRows.includes(category.id!);

      return (
        <div style={{ display: 'contents' }}>
          <DraggableRow
            index={index}
            type="category"
            moveRow={(dragIndex, hoverIndex) =>
              moveRow(dragIndex, hoverIndex, 'category')
            }
            id={category.id}
            toggleRow={toggleRow}
            style={{
              cursor: 'pointer',
              backgroundColor: '#E1F3F8',
              borderBottom: '1px solid black',
              fontWeight: 'bold',
              fontSize: '1.25em'
            }}
          >
            <td colSpan={6} className="padding-2 padding-left-0">
              {category.name}
            </td>
          </DraggableRow>

          {isExpanded &&
            renderSubCategories(category.subCategories, category.id)}
        </div>
      );
    });

  return (
    <table
      style={{ width: '101%', overflow: 'auto', borderCollapse: 'collapse' }}
    >
      <thead>
        <tr>
          <th
            style={{
              borderBottom: '1px solid black',
              padding: '1rem',
              paddingLeft: '0px',
              textAlign: 'left',
              width: '190px',
              minWidth: '190px',
              maxWidth: '190px'
            }}
          >
            Name
          </th>
          <th
            style={{
              borderBottom: '1px solid black',
              padding: '1rem',
              paddingLeft: '0px',
              textAlign: 'left',
              width: '190px',
              minWidth: '190px',
              maxWidth: '190px'
            }}
          >
            Facilitated By
          </th>
          <th
            style={{
              borderBottom: '1px solid black',
              padding: '1rem',
              paddingLeft: '0px',
              textAlign: 'left',
              width: '190px',
              minWidth: '190px',
              maxWidth: '190px'
            }}
          >
            Solutions
          </th>
          <th
            style={{
              borderBottom: '1px solid black',
              padding: '1rem',
              paddingLeft: '0px',
              textAlign: 'left',
              width: '190px',
              minWidth: '190px',
              maxWidth: '190px'
            }}
          >
            Need By
          </th>
          <th
            style={{
              borderBottom: '1px solid black',
              padding: '1rem',
              paddingLeft: '0px',
              textAlign: 'left',
              width: '190px',
              minWidth: '190px',
              maxWidth: '190px'
            }}
          >
            Status
          </th>
          <th
            style={{
              borderBottom: '1px solid black',
              padding: '1rem',
              paddingLeft: '0px',
              textAlign: 'left',
              width: '190px',
              minWidth: '190px',
              maxWidth: '190px'
            }}
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>{renderCategories()}</tbody>
    </table>
  );
};

export default NestedTable;
