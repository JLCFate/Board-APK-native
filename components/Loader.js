import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Spinner } from "@ui-kitten/components";

export default function Loader() {
	return <Spinner style={style.bar} size="giant" />;
}

const style = StyleSheet.create({
	bar: {
		backgroundColor: "transparent",
		color: "red",
	},
});
