import * as React from "react";

import {
	Box,
	Button,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
} from "@mui/material";

import FigurineService from "../../services/figurine.service";
import { enqueueSnackbar } from "notistack";
import { addServiceSnackbarWrapper } from "../../utils";
import { useTranslation } from "react-i18next";
import Table from "../../core/table";
import ImageCell from "../../core/table/ImageCell";

const FigurineTable = (props) => {
	const { currentPackageId, ...rest } = props;
	const { t } = useTranslation();

	const [figurines, setFigurines] = React.useState([]);

	React.useEffect(() => {
		FigurineService.getFigurinesByPackage(currentPackageId).then((data) =>
			setFigurines(data)
		);
	}, [currentPackageId]);

	const addRow = (object) => {
		const formData = new FormData();

		Object.keys(object).forEach((key) => {
			if (key === "images") {
				for (let i = 0; i < object.images.length; i++) {
					formData.append(key, object.images[i]);
				}
			} else {
				formData.append(key, object[key]);
			}
		});

		formData.append("packageId", currentPackageId);

		let count = 0;

		for (let [key, value] of formData.entries()) {
			if (
				(typeof value === "string" && value.length === 0) ||
				(key === "images" && value.size === 0)
			) {
				count++;
				enqueueSnackbar("Puste pole: " + key, {
					autoHideDuration: 3000,
					variant: "error",
				});
			}
		}
		if (count === 0) {
			addServiceSnackbarWrapper(FigurineService.addFigurine(formData));
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 80 },
		{
			field: "images",
			headerName: "Image",
			width: 150,
			renderCell: (params) => <ImageCell value={params.value} />,
		},
		{
			field: "name",
			headerName: t("item.productName"),
			flex: 1,
			editable: true,
		},
		{
			field: "condition",
			headerName: t("item.condition"),
			flex: 1,
			editable: true,
		},
		{
			field: "price",
			headerName: t("item.price"),
			flex: 1,
			editable: true,
		},
		{
			field: "character",
			headerName: t("item.character"),
			flex: 1,
			editable: true,
		},
		{
			field: "origin",
			headerName: t("item.origin"),
			flex: 1,
			editable: true,
		},
		{
			field: "company",
			headerName: t("item.company"),
			flex: 1,
			editable: true,
		},
		{ field: "type", headerName: t("item.type"), flex: 1, editable: true },
		{
			field: "soldAt",
			headerName: t("item.soldAt"),
			type: "dateTime",
			// valueGetter: ({ value }) => value && new Date(value),
			flex: 1,
			editable: true,
		},
	];

	return (
		<Box {...rest}>
			<Table
				tableName="figurines"
				rows={figurines}
				columns={columns}
				addRow={addRow}
				deleteRow={(id) =>
					addServiceSnackbarWrapper(
						FigurineService.removeFigurine(id)
					)
				}
			/>
		</Box>
	);
};

export default FigurineTable;
