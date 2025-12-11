import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { viewDocumentModuleDraft } from "../../../services/documentModules/DocumentsModule";
import { useSelector } from "react-redux";
import RoleSection from "./RoleSection";

const Configure = ({
  ownersData,
  endUserData,
  data,
  setData,
  setDraftData,
}) => {
  const { t } = useTranslation();
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [docDraftData, setDocDraftData] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [rejectedUserIds, setRejectedUserIds] = useState([]);
  const theme = useTheme();
  const getUserColor = (status, isSelected) => {
    if (status === "Rejected") return "red";
    else if (isSelected) return theme.palette.primary.main;
    else if ((!isSelected && status === null) || status === "Pending")
      return "gray";
  };

  const dataKeyMap = {
    StakeHolders: "StakeHolder",
    Checkers: "Checker",
    EscalationPersons: "EscalationPerson",
    Approvers: "Approver",
  };

  
  const handleUserSelect = (roleKey, userId) => {
   
    setSelectedUsers((prevSelected) => {
      const current = prevSelected[roleKey] || [];
      const isAlreadySelected = current.includes(userId);
      const updated = isAlreadySelected
        ? current.filter((id) => id !== userId)
        : [...current, userId];

    
      setData((prevData) => {
        const dataKey = dataKeyMap[roleKey];
        if (!dataKey) return prevData;

        const draftUsers = docDraftData?.[roleKey] || [];
        const draftUserIds = draftUsers.map((u) => u.UserID);

        let newSelectedIds = [...draftUserIds];
        if (isAlreadySelected) {
          
          newSelectedIds = newSelectedIds.filter((id) => id !== userId);
        } else {
        
          if (!newSelectedIds.includes(userId)) newSelectedIds.push(userId);
        }

        return {
          ...prevData,
          [dataKey]: newSelectedIds,
        };
      });

      return { ...prevSelected, [roleKey]: updated };
    });
  };

  const getMergedUsers = (source = [], draftUsers = []) =>
    draftUsers.map((draftUser) => {
      const userFromSource = source.find(
        (user) => user.UserID === draftUser.UserID
      );
      return {
        UserID: draftUser.UserID,
        UserName:
          userFromSource?.UserName || draftUser.UserName || draftUser.UserID,
        ApprovalStatus: draftUser.ApprovalStatus || null,
        IsDraft: true,
        IsReviewer: draftUser.IsReviewer || null,
        IsStakeHolder: draftUser.IsStakeHolder || null,
        IsEditable: draftUser.IsEditable,
      };
    });

  const fetchDocumentDraftData = async (documentID = null) => {
    const requestData = {
      DocumentID: documentID,
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
    };

    try {
      const response = await viewDocumentModuleDraft(requestData);
      if (response?.status === 200) {
        const draft = response?.data?.data?.documentDraft;
        console.log("Fetched Document Draft Data:", draft);
        setDocDraftData(draft);
        setDraftData(draft); 

        const initialSelected = {};
        let rejectedUserIDs = [];
        let rejectedByRole = null;

        for (const key of Object.keys(dataKeyMap)) {
          const users = draft?.[key] || [];
          const userIDs = users.map((user) => {
            if (user?.ApprovalStatus?.toLowerCase() === "rejected") {
              rejectedByRole ??= key;
            }
            return user.UserID;
          });
          initialSelected[key] = userIDs;
        }

     
        const addRejectedUsers = (users = []) => {
          users.forEach((user) => {
            if (!rejectedUserIDs.includes(user.UserID)) {
              rejectedUserIDs.push(user.UserID);
              user.IsEditable = false;
            }
          });
        };

        const markNotEditable = (users = []) => {
          users.forEach((user) => {
            rejectedUserIDs.push(user.UserID);
            user.IsEditable = false;
          });
        };

        switch (rejectedByRole) {
          case "StakeHolders":
            for (const key of Object.keys(dataKeyMap)) {
              const users = draft?.[key] || [];
              if (
                key === "StakeHolders" &&
                !draft?.NeedAcceptanceFromStakeHolder
              ) {
                const rejected = users.filter(
                  (u) => u.ApprovalStatus?.toLowerCase() === "rejected"
                );
                addRejectedUsers(rejected);
              } else if (
                key === "StakeHolders" &&
                draft?.NeedAcceptanceFromStakeHolder
              ) {
                addRejectedUsers(users);
              }
            }
            break;

          case "Checkers":
            for (const key of Object.keys(dataKeyMap)) {
              if (key !== "StakeHolder") {
                const users = draft?.[key] || [];
                if (key === "Checkers" && !draft?.NeedAcceptance) {
                  const rejected = users.filter(
                    (u) => u.ApprovalStatus?.toLowerCase() === "rejected"
                  );
                  addRejectedUsers(rejected);
                } else if (key === "Checkers" && draft?.NeedAcceptance) {
                  addRejectedUsers(users);
                }
              }
            }
            break;

          case "Approvers":
            for (const key of Object.keys(dataKeyMap)) {
              if (
                key !== "StakeHolder" &&
                key !== "Checkers" &&
                key !== "StakeHolderEscalationPerson" &&
                key !== "EscalationPersons"
              ) {
                const users = draft?.[key] || [];
                if (key === "Approvers" && !draft?.NeedAcceptanceForApprover) {
                  const rejected = users.filter(
                    (u) => u.ApprovalStatus?.toLowerCase() === "rejected"
                  );
                  rejected.forEach((user) => {
                    user.IsEditable = false;
                  });
                  addRejectedUsers(rejected);
                } else if (
                  key === "Approvers" &&
                  draft?.NeedAcceptanceForApprover
                ) {
                  addRejectedUsers(users);
                  users.forEach((user) => {
                    if (user.ApprovalStatus?.toLowerCase() === "rejected") {
                      user.IsEditable = false;
                    }
                  });
                }
              }
            }
            break;
          case "EscalationPersons": {
            const escalationUsers = draft?.EscalationPersons || [];
            const rejectedEscalation = escalationUsers.filter(
              (user) => user.ApprovalStatus?.toLowerCase() === "rejected"
            );
            rejectedEscalation.forEach((user) => {
              addRejectedUsers([user]);
              user.IsEditable = false;
              if (user.IsStakeHolder) {
                const stakeHolders = draft?.StakeHolders || [];
                addRejectedUsers(stakeHolders);
                markNotEditable(stakeHolders);
              }

              if (user.IsReviewer) {
                const checkers = draft?.Checkers || [];
                addRejectedUsers(checkers);
                markNotEditable(checkers);
              }
            });
            break;
          }
          default:
            break;
        }
        
        let selected = { ...initialSelected };
        if (rejectedByRole === "Approvers") {
          selected = Object.keys(dataKeyMap).reduce((acc, key) => {
            acc[key] =
              key === "Approvers" ? initialSelected.Approvers || [] : [];
            return acc;
          }, {});
        }

        if (
          rejectedByRole === "EscalationPersons" &&
          draft?.EscalationPersons?.some(
            (u) =>
              u.ApprovalStatus?.toLowerCase() === "rejected" && u.IsReviewer
          )
        ) {
          selected = Object.keys(dataKeyMap).reduce((acc, key) => {
            acc[key] = key !== "StakeHolders" ? initialSelected[key] || [] : [];
            return acc;
          }, {});
        }
        if (
          rejectedByRole === "EscalationPersons" &&
          draft?.EscalationPersons?.some(
            (u) =>
              u.ApprovalStatus?.toLowerCase() === "rejected" && u.IsStakeHolder
          )
        ) {
          selected = Object.keys(dataKeyMap).reduce((acc, key) => {
            acc[key] = key !== "StakeHolders" ? initialSelected[key] || [] : [];
            return acc;
          }, {});
        }

        if (rejectedByRole === "Checkers") {
          selected = Object.keys(dataKeyMap).reduce((acc, key) => {
            acc[key] = key !== "StakeHolders" ? initialSelected[key] || [] : [];
            return acc;
          }, {});
        }

        for (const key of Object.keys(selected)) {
          const selectedIds = selected[key];
          const users = draft?.[key] || [];
          let editableFn;
          switch (rejectedByRole) {
            case "StakeHolders":
              editableFn = draft?.NeedAcceptanceFromStakeHolder
                ? () => true
                : (user) => !selectedIds.includes(user.UserID);
              break;

            case "Approvers":
              editableFn = (user) => {
                // Rejected Approvers cannot be deselected
                if (user.ApprovalStatus?.toLowerCase() === "rejected") {
                  return false;
                }
                return draft?.NeedAcceptanceForApprover
                  ? !selectedIds.includes(user.UserID)
                  : true;
              };
              break;

            case "Checkers":
              editableFn = draft?.NeedAcceptance
                ? () => false
                : (user) => !selectedIds.includes(user.UserID);

              break;

            default:
              editableFn = (user) => !selectedIds.includes(user.UserID);
          }

          users.forEach((user) => {
            user.IsEditable = editableFn(user);
          });
        }

        setRejectedUserIds([...new Set(rejectedUserIDs)]);
        setSelectedUsers(selected);
        setData((prev) => {
          const updated = { ...prev };
          for (const [roleKey, dataKey] of Object.entries(dataKeyMap)) {
            updated[dataKey] = selected[roleKey] || [];
          }
          return updated;
        });
        setDraftData((prev) => {
          const updated = { ...prev };
          for (const [roleKey, dataKey] of Object.entries(dataKeyMap)) {
            updated[dataKey] = selected[roleKey] || [];
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching document draft data:", error);
    }
  };

  useEffect(() => {
    if (data?.DocumentID) {
      fetchDocumentDraftData(data.DocumentID);
    }
  }, [data?.DocumentID]);

  const allUsers = [...ownersData, ...endUserData];

  const getUserNameById = (id) => {
    const user = allUsers.find((u) => u.UserID === id);
    return user ? user.UserName || id : id;
  };

  const roleConfigs = [
    {
      key: "StakeHolders",
      dataKey: "StakeHolder",
      label: t("Stakeholders"),
      source: allUsers,
    },
    {
      key: "Checkers",
      dataKey: "Checker",
      label: t("Reviewers"),
      source: allUsers,
    },
    {
      key: "EscalationPersons",
      dataKey: "EscalationPerson",
      label: t("Escalation"),
      source: allUsers,
    },
    {
      key: "StakeHolderEscalationPerson",
      dataKey: "StakeHolderEscalationPerson",
      label: t("Stakeholder Escalation"),
      source: allUsers,
    },
    {
      key: "Approvers",
      dataKey: "Approver",
      label: t("Approvers"),
      source: allUsers,
    },
  ];
  return (
    <Box
      sx={{ p: 3, height: "600px", overflowY: "auto", backgroundColor: "#fff" }}
    >
      {docDraftData &&
        roleConfigs.map(({ key, label, source }) => {
          const draftUsers = docDraftData?.[key] || [];
          if (source.length > 0 && draftUsers.length > 0) {
            const users = getMergedUsers(source, draftUsers);
            return (
              <RoleSection
                key={key}
                title={label}
                roleKey={key}
                users={users}
                selectedIds={selectedUsers[key] || []}
                rejectedIds={rejectedUserIds}
                handleSelect={handleUserSelect}
                getUserColor={getUserColor}
              />
            );
          }
          return null;
        })}

      <Box mt={3}>
        <Typography variant="body2" color="textSecondary" mb={1}>
          {t("Comments")}
        </Typography>
        <TextField
          multiline
          rows={3}
          placeholder={t("documentDescription")}
          variant="outlined"
          fullWidth
          value={data?.Comment || ""}
          onChange={(e) => {
            const cleanText = e.target.value.replace(/<.*?>/g, "");
            setData((prevData) => ({
              ...prevData,
              Comment: cleanText,
            }));
          }}
        />
      </Box>

      <Box mt={3}>
        <Typography variant="body2" fontWeight={600}>
          {t("Selected Users by Role")}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          <Stack spacing={2}>
            {Object.entries(selectedUsers).map(([role, ids]) => (
              <Box key={role}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {t(role)}
                </Typography>
                <Stack pl={2} spacing={0.5}>
                  {ids.map((id) => (
                    <Typography key={id} variant="body2">
                      • {getUserNameById(id)}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

Configure.propTypes = {
  allUsers: PropTypes.arrayOf(
    PropTypes.shape({
      UserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      UserName: PropTypes.string,
    })
  ).isRequired,
  endUserData: PropTypes.arrayOf(
    PropTypes.shape({
      UserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      UserName: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.shape({
    StakeHolder: PropTypes.array,
    StakeHolderEscalationPerson: PropTypes.array,
    Checker: PropTypes.array,
    EscalationPerson: PropTypes.array,
    Approver: PropTypes.array,
    DocumentID: PropTypes.string,
  }).isRequired,
  setData: PropTypes.func.isRequired,
  setDraftData: PropTypes.func.isRequired,
};

export default Configure;
