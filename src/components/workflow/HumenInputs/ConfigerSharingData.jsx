// DataSelectorModal.jsx

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Collapse,
  List,
  ListItem,
  Button,
  Divider,
  Checkbox,
} from "@mui/material";
import { Close, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useReactFlow } from "@xyflow/react";

export default function ConfigerSharingData({
  nodeData,
  selectedFields,
  onSelectField,
}) {
  const [isExpanded, setIsExpanded] = React.useState({});
  const [listData, setListData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleToggle = (i) => {
    setIsExpanded({ ...isExpanded, [i]: !isExpanded[i] });
  };
  const [parentIds, setParentIds] = React.useState([]);
  const { getEdges } = useReactFlow();
  const generateParentIds = async (edges)=>{
    const ids = new Set();
    const getParentIds = async (id) => {
      const data = edges.filter(ed => ed.target.toString() === id.toString() && !ed.source.includes('start'));
      for await (const el of data) {
        if (el.source.includes('Yes')) {
          const source = Number(el.source.replace('Yes', ''));
          ids.add(source);
         await getParentIds(source)
        } else if (el.source.includes('No')) {
          const source = Number(el.source.replace('No', ''));
          ids.add(source);
         await getParentIds(source)
        } else {
          ids.add(el.source)
         await getParentIds(el.source)
        }
      }
    }
   await getParentIds(nodeData?.id)
    setParentIds([...ids]);
  }
  useEffect(() => {
    generateParentIds(getEdges());
  }, [getEdges, nodeData?.id])

  useEffect(() => {
    const list = [];
    if (parentIds.length) {
      for (const el of parentIds) {
        for (const [k, v] of Object.entries(nodeData?.data)) {
          if (el?.toString() === k.toString()) {
            if (v.type === "Create Form") {
              const childs = [];
              for (const field of v?.form || []) {
                childs.push({ label: field.label });
              }
              list.push({
                title: v?.title,
                id: k,
                childs,
              });
            }
          }
        }
      }
    }
    setListData(list);
  }, [parentIds]);

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button
        variant="contained"
        disabled={!parentIds.length}
        onClick={() => {
          setOpen(!open);
        }}
      >
        Select Previous Data
      </Button>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "80hv",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
              color: "grey.500",
            }}
          >
            <Close />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Data Selector
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle2">Select Fields to Add:</Typography>
          </Box>

          {/* Main List Header */}

          {listData?.map((item, i) => (
            <>
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  marginBottom: 1,
                }}
                onClick={() => {
                  handleToggle(i);
                }}
              >
                <Typography variant="body1">{item?.title}</Typography>
                <IconButton size="small">
                  {!!isExpanded[i] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              {/* Dropdown Items */}
              <Collapse in={isExpanded[i]}>
                <List
                  sx={{
                    padding: 0,
                    "& .MuiListItem-root": {
                      padding: "4px 8px",
                    },
                  }}
                >
                  {item?.childs?.map((el) => (
                    <ListItem key={el.label} disableGutters>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {el.label}
                      </Typography>
                      <Checkbox
                        checked={selectedFields[item.id]?.includes(el?.label)}
                        onChange={(e) =>
                          onSelectField(e.target.checked, item.id, el?.label)
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          ))}
        </Box>
      </Modal>
    </div>
  );
}
