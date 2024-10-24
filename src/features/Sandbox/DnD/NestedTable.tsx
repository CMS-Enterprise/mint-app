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

  const moveRow = (
    dragIndex,
    hoverIndex,
    type,
    parentId,
    subID,
    milestoneID
  ) => {
    // console.log('dragIndex', dragIndex);
    // console.log('hoverIndex', hoverIndex);
    // console.log('type', type);
    // console.log('parentId', parentId);
    // Clone the existing data
    const updatedData = [...data];

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

    // console.log('rawData', rawData);
    // console.log('data', data);
    // console.log('updatedData', updatedData);
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
          moveRow(
            dragIndex,
            hoverIndex,
            'milestone',
            categoryID,
            subID,
            milestone.id
          )
        }
        data={milestone}
        id={milestone.id}
      >
        <td>{milestone.name}</td>
        <td>{milestone.facilitatedBy}</td>
        <td>{milestone.needBy}</td>
        <td>{milestone.status}</td>
        <td>{milestone.actions}</td>
      </DraggableRow>
    ));

  const renderSubCategories = (subCategories, categoryID) =>
    subCategories.map((sub, index) => {
      const isExpanded = subExpandedRows.includes(sub.id!);
      console.log(subExpandedRows, sub.id);
      console.log(isExpanded);

      return (
        <div style={{ display: 'contents' }}>
          <DraggableRow
            index={index}
            type="subcategory"
            moveRow={(dragIndex, hoverIndex) =>
              moveRow(dragIndex, hoverIndex, 'subcategory', categoryID, sub.id)
            }
            data={sub}
            id={sub.id}
            toggleRow={toggleSubRow}
          >
            <td colSpan={5}>{sub.name}</td>
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
              moveRow(dragIndex, hoverIndex, 'category', category.id)
            }
            data={category}
            id={category.id}
            toggleRow={toggleRow}
          >
            <td colSpan={5}>{category.name}</td>
          </DraggableRow>

          {isExpanded &&
            renderSubCategories(category.subCategories, category.id)}
        </div>
      );
    });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Facilitated By</th>
          <th>Need By</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{renderCategories()}</tbody>
    </table>
  );
};

export default NestedTable;
