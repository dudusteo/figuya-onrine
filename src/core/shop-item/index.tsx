import * as React from "react";

import {
	Box,
	Breadcrumbs,
	Button,
	CssBaseline,
	Link,
	Typography,
} from "@mui/material";
import { ShopContext } from "../../context/shop-context";
import { useTranslation } from "react-i18next";
import { Figurine } from "../../interfaces";
import ImageProduct from "./ImageProduct";

interface ShopItemProps {
	item: Figurine;
}

const ShopItem = ({ item }: ShopItemProps) => {
	const { addToCart } = React.useContext(ShopContext);

	const { t } = useTranslation();

	if (!item) {
		return <div>Loading...</div>;
	}

	const title = item.name + " - " + item.origin + " - " + item.company;
	const priceTitle = t("price") + " " + item.price + " " + t("unit");

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				m: 4,
			}}
		>
			<CssBaseline />

			<Box
				sx={{
					height: "30rem",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						my: 2,
					}}
				>
					<Breadcrumbs separator="-" sx={{ flexGrow: 1 }}>
						<Link underline="hover" href="/">
							Figuya Onrine
						</Link>
						<Link underline="hover" href="/">
							{item.origin}
						</Link>
					</Breadcrumbs>
					<Typography>{"Similiar products"}</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<ImageProduct images={item.images}></ImageProduct>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							mx: 4,
						}}
					>
						<Typography variant="h5" sx={{ color: "primary.main" }}>
							{title}
						</Typography>
						<Typography
							variant="subtitle1"
							sx={{ color: "primary.main", flexGrow: 1 }}
						>
							{item.condition}
						</Typography>
						<Typography
							variant="h4"
							sx={{
								color: "primary.main",
								fontWeight: "bold",
								my: 1,
							}}
						>
							{priceTitle}
						</Typography>
						<Button
							variant="contained"
							onClick={() => addToCart(item)}
							sx={{ width: "11rem" }}
						>
							{t("add-to-cart")}
						</Button>
						<Box sx={{ flexGrow: 1 }}></Box>
						<Typography
							variant="subtitle1"
							sx={{ color: "primary.main" }}
						>
							{"rest"}
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ShopItem;
