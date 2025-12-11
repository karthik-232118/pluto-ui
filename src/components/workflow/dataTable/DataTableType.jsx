import React, { useEffect, useState, useCallback } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  useHandleConnections,
  useNodesData,
} from "@xyflow/react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  TableSortLabel,
  Toolbar,
  InputBase,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData, updatePropsData } from "../../../store/flow/slice";
import { GetUserList, openSidbar } from "../../../store/flow/action";
import edit from "../../../assets/svg/reactflow/edit.svg";
import trash from "../../../assets/svg/reactflow/trash.svg";
import pin from "../../../assets/svg/reactflow/pin.svg";
import copy from "../../../assets/svg/reactflow/copy.svg";

// 🔹 Define Columns & Rows Outside the Component
const TABLE_COLUMNS = [
  { id: "col1", label: "Column 1" },
  { id: "col2", label: "Column 2" },
  { id: "col3", label: "Column 3" },
];

const TABLE_ROWS = [
  { col1: "Row 1 Col 1", col2: "Row 1 Col 2", col3: "Row 1 Col 3" },
  { col1: "Row 2 Col 1", col2: "Row 2 Col 2", col3: "Row 2 Col 3" },
  { col1: "Row 3 Col 1", col2: "Row 3 Col 2", col3: "Row 3 Col 3" },
  { col1: "Row 4 Col 1", col2: "Row 4 Col 2", col3: "Row 4 Col 3" },
];

// 🔹 Styled Search Bar
const SearchBar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DataTableType = ({ id, type, isConnectable, data }) => {
  // start

  const configData = useSelector((state) => state.workflow.configData);
  const serviceList = useSelector((state) => state.workflow.getallservices);
  const flowDataById = useSelector((state) => state.workflow.getflowdatafromId);
  const [ServiceID, setServiceId] = useState("");
  const dataId = useSelector((state) => state.workflow.data.id);

  const dispatch = useDispatch();
  const { updateNodeData, getNode, addNodes, setNodes, setEdges } =
    useReactFlow();
  const connections = useHandleConnections({
    type: "target",
  });
  const nodesData = useNodesData(
    connections.map((connection) => connection.source)
  );

  useEffect(() => {
    const detail = flowDataById.Details?.find(
      (x) => x.ShapeID === id.toString()
    )?.DetailsProperties;
    if (detail) {
      dispatch(updateConfigData({ id, value: detail }));
    }
  }, [flowDataById, id]);

  useEffect(() => {
    for (const el of serviceList) {
      for (const item of el.ServiceElements) {
        if (item.ServiceElementName === type) {
          setServiceId(item.FlowServiceElementID);
        }
      }
    }
    // dispatch(
    //   GetUserList({
    //     SearchString: "",
    //     Limit: 1000,
    //     Page: 1,
    //   })
    // );
  }, [serviceList, type]);

  useEffect(() => {
    const parentIds = [id];
    for (const el of nodesData) {
      if (el.data?.parentIds) parentIds.push(...el.data?.parentIds);
    }
    updateNodeData(id, { parentIds });
    if (nodesData.length) dispatch(updatePropsData({ id, value: nodesData }));
  }, [nodesData]);

  useEffect(() => {
    if (!configData[id] && ServiceID) {
      const payload = { title: type, type, ServiceID };
      if (type === "Gmail") {
        payload["EmailRecipient"] = "";
        payload["EmailSubject"] = "";
        payload["BodyType"] = "text";
        payload["MessageBody"] = "";
        payload["CCEmails"] = [""];
        payload["BCCEmails"] = [""];
        payload["ActionRequired"] = false;
      }
      if (type === "Create Form") {
        payload["sharedFields"] = {
          [id]: [],
        };
      }
      dispatch(
        updateConfigData({
          id,
          value: payload,
        })
      );
    }
  }, [ServiceID]);

  const handleClikonedit = () => {
    dispatch(
      openSidbar({
        name: type,
        open: true,
        id,
      })
    );
  };

  const toggleSidebar = () => {
    dispatch(
      openSidbar({
        name: type,
        open: false,
        id: id,
      })
    );
  };

  const copyNode = () => {
    const copynode = getNode(id);
    const newNode = {
      ...copynode,
      id: new Date().getTime().toString(),
      position: { x: copynode.position.x + 50, y: copynode.position.y + -50 }, // Apply slight position offset
    };
    addNodes(newNode);
    dispatch(
      updateConfigData({
        id: newNode.id,
        value: configData[id],
      })
    );
  };
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes?.filter((node) => node.id !== id));
    setEdges((edges) => edges?.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  // end

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(TABLE_COLUMNS[0].id);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(TABLE_ROWS.map((row, index) => index));
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event, index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected =
      selectedIndex === -1
        ? [...selected, index]
        : selected.filter((item) => item !== index);
    setSelected(newSelected);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // 🔹 Filter & Sort Rows Dynamically
  const filteredRows = TABLE_ROWS.filter((row) =>
    Object.values(row).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )
    .sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      {dataId === id && (
        <div className="node-actions">
          <Box onClick={copyNode}>
            <img src={copy} alt="copy" />
          </Box>
          <Box onClick={handleClikonedit}>
            <img src={edit} alt="edit" />
          </Box>
          <Box onClick={deleteNode}>
            <img src={trash} alt="trash" />
          </Box>
          <Box onClick={handleClikonedit}>
            <img src={pin} alt="pin" />
          </Box>
        </div>
      )}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/reactflow", `${data?.label}`);
          e.dataTransfer.effectAllowed = "move";
        }}
        style={{
          width: "100%",
          padding: 10,
          background: "white",
          borderRadius: 8,
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h4 style={{ textAlign: "center", margin: 0 }}>{data?.label}</h4>

        {/* 🔹 Search Bar */}
        <SearchBar>
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ flex: 1, paddingLeft: 8 }}
          />
        </SearchBar>

        {/* 🔹 Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < TABLE_ROWS.length
                    }
                    checked={
                      TABLE_ROWS.length > 0 &&
                      selected.length === TABLE_ROWS.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {TABLE_COLUMNS.map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row, index) => {
                const isSelected = selected.includes(index);
                return (
                  <TableRow key={index} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => handleCheckboxClick(event, index)}
                      />
                    </TableCell>
                    {TABLE_COLUMNS.map((column) => (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🔹 Pagination */}
        <TablePagination
          count={TABLE_ROWS.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 15]}
        />

        {/* 🔹 Handles for Connecting Nodes */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={{ background: "#555" }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="t"
          style={{ background: "#555" }}
        />
      </div>
    </>
  );
};

export default DataTableType;
