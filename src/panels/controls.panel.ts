export class ControlsPanel {
    onClearClick: CallableFunction = () => {};
    onSaveClick: CallableFunction = () => {};
    onLoad: CallableFunction = () => {};
    onExportClick: CallableFunction = () => {};
    protected clearBtn: HTMLButtonElement;
    protected saveBtn: HTMLButtonElement;
    protected loadBtn: HTMLButtonElement;
    protected exportBtn: HTMLButtonElement;
    protected fileInput: HTMLInputElement;

    constructor() {
        this.clearBtn = document.getElementById("clear")! as HTMLButtonElement;
        this.saveBtn = document.getElementById("save")! as HTMLButtonElement;
        this.loadBtn = document.getElementById("load")! as HTMLButtonElement;
        this.exportBtn = document.getElementById("export")! as HTMLButtonElement;
        this.fileInput = document.getElementById("file-input")! as HTMLInputElement;
        this.init();
    }

    protected init() {
        this.clearBtn.addEventListener("click", () => this.onClearClick());
        this.saveBtn.addEventListener("click", () => this.onSaveClick());
        this.loadBtn.addEventListener("click", () => {
                this.fileInput.click();
            });
        this.exportBtn.addEventListener("click", () => this.onExportClick());

        this.fileInput.addEventListener("change", (event) => {
            const fileInput = event.target as HTMLInputElement;
            const file = fileInput.files![0];
            const reader = new FileReader();

            reader.onload = (readerEvent) => {
                const jsonData = readerEvent.target!.result as string;
                this.onLoad(jsonData);
            };

            reader.readAsText(file);
        });
    }
}
