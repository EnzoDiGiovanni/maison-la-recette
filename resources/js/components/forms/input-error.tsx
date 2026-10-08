export default function InputError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p role="alert">{message}</p>;
}
