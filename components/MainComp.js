import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";
import { Image } from "react-native";

export default function MainComp(props) {
	return (
		<React.Fragment>
			<Image style={style.logo} source={require("../assets/main-logo.png")} />
			{!props.isLoading && <Text style={[style.heading, style.shadowProp]}>Kontroler bramy</Text>}
		</React.Fragment>
	);
}

const style = StyleSheet.create({
	heading: {
		color: "#ffffff",
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 50,
		textShadowColor: "#000000",
		textShadowOffset: {
			width: 0,
			height: 3,
		},
		textShadowRadius: 10,
		elevation: 5,
	},
	logo: {
		width: 150,
		height: 125,
		resizeMode: "contain",
		marginBottom: 25,
	},
	shadowProp: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 10,
		shadowOpacity: 1.0,
		elevation: 5,
	},
});
