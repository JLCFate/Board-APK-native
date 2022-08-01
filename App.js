import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout } from "@ui-kitten/components";
import { StatusBar } from "expo-status-bar";
import { default as theme } from "./assets/custom-theme.json";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

import Loader from "./components/Loader";
import MainComp from "./components/MainComp";
import Controller from "./components/Controller";
import Unauthorized from "./components/Unauthorized";
import Awaiting from "./components/Awaiting";

const getUniqueID = async (check) => {
	let uuid = uuidv4();
	let fetchUUID = await SecureStore.getItemAsync("secure_deviceid");
	if (!fetchUUID) await SecureStore.setItemAsync("secure_deviceid", uuid);
	check();
};

export default function App() {
	const [authorized, setAuthorized] = React.useState(null);
	const [awaiting, setAwaiting] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	const selectActivity = (result) => {
		result();
		setIsLoading(false);
	};

	const callForCheck = async () => {
		const id = await SecureStore.getItemAsync("secure_deviceid");

		const socket = await io("http://192.168.1.231:4001", {
			extraHeaders: {
				"X-Address": id,
				"X-Name": Device.modelName,
			},
		});

		socket.on("failed", (data) => {
			if (data.status === "unauthorized") selectActivity(() => setAuthorized(false));
			else selectActivity(() => setAwaiting(true));
			socket.disconnect();
		});

		socket.on("authorized", () => {
			selectActivity(() => setAuthorized(true));
			socket.disconnect();
		});
	};

	useEffect(() => {
		getUniqueID(() => callForCheck());
	}, []);

	return (
		<React.Fragment>
			<StatusBar style="light" />
			<ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
				<Layout style={style.container}>
					<MainComp isLoading={isLoading} />
					{isLoading ? <Loader /> : authorized ? <Controller /> : awaiting ? <Awaiting /> : <Unauthorized />}
				</Layout>
			</ApplicationProvider>
		</React.Fragment>
	);
}

const style = StyleSheet.create({
	container: {
		display: "flex",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#2f3136",
	},
});
