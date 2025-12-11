import { Chip, Stack, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
const getNestedValue = (obj, key, nestedKey) => {
  let value = obj[key]; 
  if (nestedKey && value) {
    value = value[nestedKey];
  }
  return value;
};

const ChipWithTooltip = ({ data = [], firstLevelKey = "", nestedKey = "" }) => {
  if (!data || data.length === 0 || !firstLevelKey) return null;
  const firstReceiver = data[0];
  const remainingReceivers = data.slice(1);
  const firstReceiverValue = getNestedValue(
    firstReceiver,
    firstLevelKey,
    nestedKey
  );
  const truncatedValue =
    firstReceiverValue && firstReceiverValue.length > 40
      ? `${firstReceiverValue.slice(0, 40)}...`
      : firstReceiverValue;
  const remainingReceiverValues = remainingReceivers.map((item) =>
    getNestedValue(item, firstLevelKey, nestedKey)
  );
  return (
    <Stack direction={"row"} gap={0.5} p={1} alignItems="center">
      <Tooltip title={firstReceiverValue} arrow>
        <Chip
          sx={{ color: "#344054", marginLeft: "8px", fontSize: "16px" }}
          label={truncatedValue}
          size="small"
        />
      </Tooltip>
      {remainingReceiverValues.length > 0 && (
        <Tooltip title={remainingReceiverValues.join(", ")} arrow>
          <Chip
            sx={{ color: "#344054", marginLeft: "8px", fontSize: "16px" }}
            label={`+${remainingReceiverValues.length}`}
            size="small"
          />
        </Tooltip>
      )}
    </Stack>
  );
};

export default ChipWithTooltip;

ChipWithTooltip.propTypes = {
  data: PropTypes.array,
  firstLevelKey: PropTypes.string.isRequired,
  nestedKey: PropTypes.string,
};
ChipWithTooltip.defaultProps = {
  data: [],
  nestedKey: "",
};
ChipWithTooltip.displayName = "ChipWithTooltip";
