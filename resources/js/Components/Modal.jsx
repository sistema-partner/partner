import { Dialog } from "primereact/dialog";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthPx = {
        sm: "400px",
        md: "500px",
        lg: "600px",
        xl: "700px",
        "2xl": "800px",
    }[maxWidth];

    return (
        <Dialog
            visible={show}
            onHide={close}
            style={{ width: maxWidthPx }}
            className="partner-modal"
            modal
            dismissableMask={closeable}
        >
            {children}
        </Dialog>
    );
}
