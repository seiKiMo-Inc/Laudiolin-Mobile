import { useState } from "react";
import { TextInput, View } from "react-native";

import StyledText, { Size } from "@components/StyledText";

import style from "@style/Laudiolin";

function TextPlayground() {
    const [text, setText] = useState("Hello World!");

    return (
        <View style={{
            ...style.App,
            padding: 10,
            gap: 15
        }}>
            <TextInput
                style={{
                    color: "white", borderColor: "white", borderWidth: 1, width: "80%",
                    margin: 10, alignSelf: "center", textAlign: "center"
                }}
                onChange={e => setText(e.nativeEvent.text)}
            >
                {text}
            </TextInput>

            <View>
                <StyledText text={text} size={Size.Footnote} />
                <StyledText text={text} size={Size.Text} />
                <StyledText text={text} size={Size.Subheader} />
                <StyledText text={text} size={Size.Header} />
                <StyledText text={text} size={Size.Title} />
            </View>

            <View>
                <StyledText text={text} bold size={Size.Footnote} />
                <StyledText text={text} bold size={Size.Text} />
                <StyledText text={text} bold size={Size.Subheader} />
                <StyledText text={text} bold size={Size.Header} />
                <StyledText text={text} bold size={Size.Title} />
            </View>
        </View>
    );
}

export default TextPlayground;
