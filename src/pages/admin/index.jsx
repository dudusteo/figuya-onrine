import * as React from "react";

import { Box, CssBaseline } from "@mui/material";
import AuthService from "../../services/auth.service";

import PackageTable from "./PackageTable";
import FigurineTable from "./FigurineTable";

const Admin = () => {
	const [showAdminBoard, setShowAdminBoard] = React.useState(false);

	React.useEffect(() => {
		const user = AuthService.getCurrentUser();

		if (user) {
			setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
		}
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<CssBaseline />
			{showAdminBoard && (
				<>
					<PackageTable sx={{ my: 2 }}></PackageTable>
					<FigurineTable sx={{ my: 2 }}></FigurineTable>
				</>
			)}
		</Box>
	);
};

export default Admin;
