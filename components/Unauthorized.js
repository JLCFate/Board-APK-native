import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, Icon } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function Unauthorized() {
	return (
		<React.Fragment>
			<FontAwesomeIcon size={32} icon={faTriangleExclamation} style={styles.icon} />
			<Text category="h6">Brak dostępu do systemu</Text>
			<Text>Urządzenie nie przeszło kontroli dostępu</Text>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	icon: {
		marginBottom: 10,
		color: "#C9D334",
	},
});
