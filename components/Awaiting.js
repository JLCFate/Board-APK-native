import React, { useEffect } from "react";
import { StyleSheet, TouchableHighlight, Image, View } from "react-native";
import { Text, Spinner } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function Awaiting(props) {
	const [disabled, setDisabled] = React.useState(false);
	const { refresh } = props;
	const timer = React.useRef(null);

	const press = async () => {
		setDisabled(true);

		await refresh();

		timer.current = setTimeout(() => {
			setDisabled(false);
		}, 1500);
	};

	useEffect(() => {
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	return (
		<View style={style.bigContainer}>
			<Image source={require("../assets/pato-duck.gif")} style={style.icon} />
			<Text category="h6" style={{ marginTop: 15, marginBottom: 10 }}>
				Zgłoszenie o dostęp zostało przesłane
			</Text>
			<Text>Poczekaj na zatwierdzenie w systemie</Text>
			<View style={{ marginTop: 20 }}>
				<TouchableHighlight onPress={press} underlayColor={"#50555c"} style={{ borderRadius: 50 }}>
					<View style={style.button}>
						<View style={style.secondLine}>
							{disabled ? (
								<Spinner size="small" />
							) : (
								<FontAwesomeIcon icon={faArrowRotateRight} size={13} style={{ color: "#fff", marginRight: 10 }} />
							)}
							<Text style={disabled && [style.disabled, style.spinner]}>{disabled ? "Sprawdzam" : "Sprawdź dostęp"}</Text>
						</View>
					</View>
				</TouchableHighlight>
			</View>
		</View>
	);
}

const style = StyleSheet.create({
	icon: {
		width: 120,
		height: 146,
	},
	container: {
		display: "flex",
		flexDirection: "row",
	},
	bigContainer: {
		display: "flex",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	secondLine: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	spinner: {
		marginLeft: 10,
	},
	button: {
		color: "#f1f1f1",
		backgroundColor: "#40444b",
		borderRadius: 50,
		borderColor: "transparent",
		display: "flex",
		padding: 15,
		justifyContent: "center",
		alignItems: "center",
		width: 180,
	},
	disabled: {
		color: "#656d7d",
	},
	lastButton: {
		marginTop: 25,
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
	indicator: {
		justifyContent: "center",
		alignItems: "center",
	},
});
