import React, { useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";
import { Text } from "@ui-kitten/components";

export default function Unauthorized() {
	return (
		<View style={style.bigContainer}>
			<Image source={require("../assets/PYSK.png")} style={style.image} />
			<Text category="h6" style={{ marginTop: 15, marginBottom: 10 }}>
				Brak dostępu do systemu
			</Text>
			<Text>Urządzenie nie przeszło kontroli dostępu</Text>
		</View>
	);
}

const style = StyleSheet.create({
	bigContainer: {
		display: "flex",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		height: 110,
		width: 300,
		marginBottom: 10,
	},
});
