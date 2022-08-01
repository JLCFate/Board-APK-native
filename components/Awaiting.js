import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";

export default function Awaiting() {
	return (
		<React.Fragment>
			<FontAwesomeIcon size={32} icon={faEnvelopeOpen} style={styles.icon} />
			<Text category="h6">Zgłoszenie o dostęp zostało przesłane</Text>
			<Text>Poczekaj na wiadomość zwrotną</Text>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	icon: {
		marginBottom: 10,
		color: "#CFFDF7",
	},
});
