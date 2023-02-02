export default function Hide(props: any) {
    return (
        props.show ? props.children : null
    );
}
