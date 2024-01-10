import React, { useState } from "react";
import "./App.css";

const FileExplorer = () => {
  const [fileStructure, setFileStructure] = useState([
    {
      type: "folder",
      name: "root",
      isOpen: true,
      children: [
        {
          type: "folder",
          name: "public",
          isOpen: false,
          children: [
            {
              type: "folder",
              name: "public_nested_1",
              isOpen: false,
              children: [
                { type: "file", name: "index.html" },
                { type: "file", name: "hello.html" },
                { type: "file", name: "public_nested_file" },
              ],
            },
          ],
        },
        {
          type: "folder",
          name: "src",
          isOpen: false,
          children: [
            { type: "file", name: "App.js" },
            { type: "file", name: "Index.js" },
            { type: "file", name: "styles.css" },
            { type: "file", name: "package.json" },
          ],
        },
      ],
    },
  ]);

  const [hoveredElement, setHoveredElement] = useState(null);

  const toggleFolder = (folder) => {
    folder.isOpen = !folder.isOpen;
    setFileStructure([...fileStructure]);
  };

  const addFolderOrFile = (parentFolder, isFile) => {
    const newName = prompt(
      `Enter the name for the new ${isFile ? "file" : "folder"}:`,
      isFile ? "New File" : "New Folder"
    );

    if (newName !== null) {
      const newElement = {
        type: isFile ? "file" : "folder",
        name: newName || (isFile ? "New File" : "New Folder"),
        isOpen: true,
        children: [],
      };

      if (parentFolder.type === "folder") {
        parentFolder.children.push(newElement);
      } else {
        setFileStructure([...fileStructure, newElement]);
      }

      setFileStructure([...fileStructure]);
    }
  };

  const renameElement = (element, newName) => {
    element.name = newName;
    setFileStructure([...fileStructure]);
  };

  const deleteElement = (structure, parentFolder, index) => {
    setFileStructure((prevStructure) => {
      const newStructure = parentFolder
        ? prevStructure.map((folder) =>
            folder.name === parentFolder.name
              ? { ...folder, children: folder.children.filter((_, i) => i !== index) }
              : folder
          )
        : prevStructure.filter((_, i) => i !== index);

      return newStructure;
    });
  };

  const handleMouseEnter = (element) => {
    setHoveredElement(element);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  const handleDoubleClick = (element, parentFolder = null) => {
    if (element.type === "folder") {
      toggleFolder(element);
    } else if (parentFolder) {
      deleteElement(parentFolder.children, null, parentFolder.children.indexOf(element));
    } else {
      deleteElement(fileStructure, null, fileStructure.indexOf(element));
    }
  };

  const renderTree = (structure, level = 0, parentFolder = null) => (
    <ul>
      {structure.map((element, index) => (
        <li
          key={index}
          onMouseEnter={() => handleMouseEnter(element)}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={() => handleDoubleClick(element, parentFolder)}
        >
          <span style={{ marginLeft: `${level * 20}px` }}>
            {element.type === "folder" && (
              <span className="icon" onClick={() => toggleFolder(element)}>
                {element.isOpen ? "📂" : "📁"}
              </span>
            )}
            {element.type === "file" && (
              <span className="icon">
                {element.isOpen ? "📄" : "📃"}
              </span>
            )}
            <span>{element.name}</span>
            {hoveredElement === element && (
              <>
                {element.type === "folder" && (
                  <>
                    <button
                      className="icon"
                      onClick={() => addFolderOrFile(element, false)}
                    >
                      📁
                    </button>
                    <button
                      className="icon"
                      onClick={() => addFolderOrFile(element, true)}
                    >
                      📄
                    </button>
                  </>
                )}
                <button
                  className="icon"
                  onClick={() =>
                    renameElement(
                      element,
                      prompt("Enter new name:", element.name)
                    )
                  }
                >
                  ✏️
                </button>

                <button
                  className="icon"
                  onClick={() =>
                    deleteElement(fileStructure, parentFolder, index)
                  }
                >
                  ❌
                </button>
              </>
            )}
          </span>
          {element.isOpen &&
            element.children &&
            renderTree(element.children, level + 1, element)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h1>File Explorer</h1>
      {renderTree(fileStructure)}
    </div>
  );
};

export default FileExplorer;
