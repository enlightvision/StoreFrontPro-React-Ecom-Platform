import { Box, Button } from "@mui/material";
import { componentPaths } from "../../api/Path";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
};

const EmptyData = (props: Props) => {
  const navigate = useNavigate();
  const { title = "Data" } = props;

  return (
    <>
      <Box
        sx={{
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img style={{}} src="./src/assets/empty-box.png" alt="Empty Box" />
        <h5 className="p-3">No {title} Found!</h5>
        <Button
          variant="outlined"
          hidden={window.location.pathname == componentPaths.home}
          onClick={() => navigate(componentPaths.home)}
        >
          Back To Home
        </Button>
      </Box>
    </>
  );
};

export default EmptyData;
