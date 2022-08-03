import React, { useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";

const ImageFade = (props) => {
	const source = props.isLoading ? require("../assets/main-logo.png") : require("../assets/ghost.png");
	const opa = props.opacity / 10;
	return <Image source={source} style={[style.backImage, { opacity: opa }]} />;
};

export default function MainComp(props) {
	const [opacity, setOpacity] = React.useState(9);
	const [direction, setDirection] = React.useState(false);

	useEffect(() => {
		let i;
		if (props.isLoading) {
			i = setInterval(() => {
				const newVal = direction ? opacity + 1 : opacity - 1;
				if (newVal == 1 || newVal == 9) setDirection(!direction);
				setOpacity(newVal);
			}, 48);
		}
		return () => clearInterval(i);
	});

	return (
		<View style={{ position: "absolute", zIndex: 1, top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
			<ImageFade isLoading={props.isLoading} opacity={opacity} />
		</View>
	);
}

const style = StyleSheet.create({
	backImage: {
		width: 250,
		height: 208,
	},
});
