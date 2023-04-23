import * as React from "react";

import { Box, Button, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";

import {
	DataGrid,
	GridActionsCellItem,
	GridRowModes,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { addServiceSnackbarWrapper } from "../../utils";

import PropTypes from "prop-types";

function EditToolbar(props) {
	const { setRows, setRowModesModel, emptyRow } = props;

	const handleClick = () => {
		let id;

		setRows((oldRows) => {
			id = oldRows.length + 1;
			return [...oldRows, { id, ...emptyRow, isNew: true }];
		});
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
		}));
	};

	return (
		<GridToolbarContainer>
			<Button
				color="primary"
				startIcon={<AddIcon />}
				onClick={handleClick}
			>
				Add record
			</Button>
		</GridToolbarContainer>
	);
}

EditToolbar.propTypes = {
	setRowModesModel: PropTypes.func.isRequired,
	setRows: PropTypes.func.isRequired,
	emptyRow: PropTypes.object.isRequired,
};

const Table = (props) => {
	const {
		addRow,
		deleteRow,
		uploadImage,
		columns: initialColumns,
		rows: initialRows,
		onSelect,
		DataGridParams,
		...rest
	} = props;

	const [columns, setColumns] = React.useState(initialColumns);
	const [rows, setRows] = React.useState(initialRows);
	const [rowModesModel, setRowModesModel] = React.useState({});
	const [selectionModel, setSelectionModel] = React.useState([]);
	const [emptyRow, setEmptyRow] = React.useState({});

	React.useEffect(() => {
		let t_object = {};
		initialColumns.forEach(
			(column) => (t_object = { ...t_object, [column.field]: "" })
		);
		delete t_object["id"];
		if (t_object.images === "") {
			t_object.images = [];
		}

		setEmptyRow(t_object);
	}, [initialColumns]);

	React.useEffect(() => {
		setRows(initialRows);
	}, [initialRows]);

	React.useEffect(() => {
		const newColumn = {
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 120,
			cellClassName: "actions",
			getActions: ({ id }) => {
				const isInEditMode =
					rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						uploadImage ? (
							<IconButton variant="contained" component="label">
								<UploadIcon />
								<input
									hidden
									accept="image/jpeg"
									multiple
									type="file"
									name="images"
									onChange={(e) => {
										handleImages(id, e.target.files);
									}}
								/>
							</IconButton>
						) : (
							<></>
						),
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							onClick={handleCancelClick(id)}
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						onClick={handleEditClick(id)}
					/>,

					deleteRow ? (
						<GridActionsCellItem
							icon={<DeleteIcon />}
							label="Delete"
							onClick={handleDeleteClick(id)}
						/>
					) : (
						<></>
					),
				];
			},
		};

		setColumns([...initialColumns, newColumn]);
	}, [initialColumns, rowModesModel, rows]);

	React.useEffect(() => {
		onSelect && onSelect(rows[selectionModel[0] - 1]?.name);
	}, [rows, onSelect, selectionModel]);

	const handleSelectionChange = (newSelection) => {
		if (newSelection.length > 1) {
			setSelectionModel([newSelection[newSelection.length - 1]]);
		} else {
			setSelectionModel(newSelection);
		}
	};

	const handleImages = (id, images) => {
		setRows(
			rows.map((row) =>
				row.id === id ? { ...row, images: images } : row
			)
		);
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View },
		});
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = rows.find((row) => row.id === id);
		//delete if thats new row
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const handleEditClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.Edit },
		});
	};

	const handleDeleteClick = (id) => () => {
		setRows(rows.filter((row) => row.id !== id));
		addServiceSnackbarWrapper(deleteRow(id));
	};

	const processRowUpdate = (newRow) => {
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		console.log(updatedRow);
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const handleRowEditStart = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	return (
		<Box {...rest}>
			<DataGrid
				rows={rows}
				columns={columns}
				editMode="row"
				checkboxSelection
				disableRowSelectionOnClick
				autoHeight
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStart={handleRowEditStart}
				onRowEditStop={handleRowEditStop}
				onRowSelectionModelChange={handleSelectionChange}
				rowSelectionModel={selectionModel}
				processRowUpdate={processRowUpdate}
				slots={{
					toolbar: EditToolbar,
				}}
				slotProps={{
					toolbar: { setRows, setRowModesModel, emptyRow },
				}}
				{...DataGridParams}
			/>
		</Box>
	);
};

export default Table;
