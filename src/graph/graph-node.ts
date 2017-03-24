import {InputPort} from "./input-port";
import {OutputPort} from "./output-port";
import {Shape} from "./shape";
import {StepModel, WorkflowInputParameterModel, WorkflowOutputParameterModel} from "cwlts/models";
import Matrix = Snap.Matrix;

export type NodePosition = { x: number, y: number };
export type NodeDataModel = WorkflowInputParameterModel | WorkflowOutputParameterModel | StepModel;

export class GraphNode extends Shape {


    public position: NodePosition = {x: 0, y: 0};

    protected paper: Snap.Paper;

    protected group;

    protected static radius = 40;

    constructor(position: Partial<NodePosition>,
                private dataModel: NodeDataModel,
                paper: Snap.Paper) {

        super();

        this.paper = paper;

        this.dataModel = dataModel;

        Object.assign(this.position, position);
    }

    private static makeIconFragment(model) {
        const modelType = model instanceof StepModel ? "step" :
            model instanceof WorkflowInputParameterModel ? "output" :
            model instanceof WorkflowOutputParameterModel ? "input" : "";
        let iconStr;

        if (modelType === "step") {
            iconStr = model.run && model.run.class === "Workflow" ? "data:image/svg+xml;base64,PHN2ZyBpZD0id29ya2Zsb3ciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUwMCA1MDAiPjx0aXRsZT53b3JrZmxvd19uZXc8L3RpdGxlPjxjaXJjbGUgY3g9IjQwMC41IiBjeT0iMjQ5LjUiIHI9Ijk5LjUiLz48Y2lyY2xlIGN4PSI5OS41IiBjeT0iOTkuNSIgcj0iOTkuNSIvPjxjaXJjbGUgY3g9Ijk5LjUiIGN5PSI0MDAuNSIgcj0iOTkuNSIvPjxnIGlkPSJMYXllcl80IiBkYXRhLW5hbWU9IkxheWVyIDQiPjxsaW5lIHgxPSI5OSIgeTE9Ijk5IiB4Mj0iNDAwIiB5Mj0iMjQ5IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo0MHB4Ii8+PGxpbmUgeDE9Ijk5IiB5MT0iNDAwIiB4Mj0iNDAwIiB5Mj0iMjQ5IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo0MHB4Ii8+PC9nPjwvc3ZnPg==" :
                model.run && model.run.class === "CommandLineTool" ? "data:image/svg+xml;base64,PHN2ZyBpZD0idG9vbCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAwLjA3IDUwMC4yNCI+PHRpdGxlPnRvb2xfbmV3PC90aXRsZT48cmVjdCB4PSIyODQuMDciIHk9IjQ1MC4wNyIgd2lkdGg9IjIxNiIgaGVpZ2h0PSI1MCIvPjxyZWN0IHg9Ii0zNC4xNCIgeT0iMTE3LjU2IiB3aWR0aD0iMzUzLjQiIGhlaWdodD0iNTAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0Mi42MiAtNTguOTgpIHJvdGF0ZSg0NSkiLz48cmVjdCB4PSItMzQuMTUiIHk9IjMzMi41MyIgd2lkdGg9IjM1My40NyIgaGVpZ2h0PSI1MCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDk2LjI4IDUwOS41OCkgcm90YXRlKDEzNSkiLz48L3N2Zz4=" : "";

        }
        else if (modelType === "input") {
            iconStr = model.type && model.type.type === "File" ||
                model.type.type === "array" ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OTkgNDYyLjg2Ij48dGl0bGU+ZmlsZV9pbnB1dDwvdGl0bGU+PGcgaWQ9IkxheWVyXzE2IiBkYXRhLW5hbWU9IkxheWVyIDE2Ij48cG9seWdvbiBwb2ludHM9IjM4Ni4wNiAwIDM4Ni4wNiAwIDE3NSAwIDE3NSA1OC4yOSAyMjUgMTA4LjI5IDIyNSA1MCAzNjUuMzUgNTAgNDQ5IDEzMy42NSA0NDkgNDEyLjg2IDIyNSA0MTIuODYgMjI1IDM1My43MSAxNzUgNDAzLjcxIDE3NSA0NjIuODYgNDk5IDQ2Mi44NiA0OTkgMTEyLjk0IDM4Ni4wNiAwIi8+PC9nPjxnIGlkPSJMYXllcl83X2NvcHkiIGRhdGEtbmFtZT0iTGF5ZXIgNyBjb3B5Ij48cG9seWxpbmUgcG9pbnRzPSI0OTguNzggMTM4Ljc2IDM2Mi45MyAxMzguMzggMzYyLjgxIDEzOC4zOCAzNjIuODEgMS4wNiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NTBweCIvPjwvZz48ZyBpZD0iTGF5ZXJfMTFfY29weSIgZGF0YS1uYW1lPSJMYXllciAxMSBjb3B5Ij48cG9seWxpbmUgcG9pbnRzPSIxNTkgMzI3IDI1NSAyMzEgMTYwIDEzNiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NTBweCIvPjxnIGlkPSJMYXllcl85X2NvcHlfMiIgZGF0YS1uYW1lPSJMYXllciA5IGNvcHkgMiI+PGxpbmUgeTE9IjIzMSIgeDI9IjI1NSIgeTI9IjIzMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NTBweCIvPjwvZz48L2c+PC9zdmc+" :
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OTkgMzY1Ij48dGl0bGU+dHlwZV9pbnB1dDwvdGl0bGU+PGcgaWQ9ImlucHV0Ij48cGF0aCBkPSJNMzE2LjUsNjhhMTgxLjcyLDE4MS43MiwwLDAsMC0xMTQuMTIsNDAuMDlMMjM4LDE0My43MmExMzIuNSwxMzIuNSwwLDEsMSwxLjE2LDIxNC4zOUwyMDMuNDgsMzkzLjhBMTgyLjUsMTgyLjUsMCwxLDAsMzE2LjUsNjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC02OCkiLz48ZyBpZD0iTGF5ZXJfMjIiIGRhdGEtbmFtZT0iTGF5ZXIgMjIiPjxnIGlkPSJMYXllcl85X2NvcHlfNCIgZGF0YS1uYW1lPSJMYXllciA5IGNvcHkgNCI+PHBvbHlnb24gcG9pbnRzPSIyOTAuMzYgMTgyIDE3Ni42OCAyOTUuNjggMTQxLjMyIDI2MC4zMiAxOTQuNjQgMjA3IDAgMjA3IDAgMTU3IDE5NC42NCAxNTcgMTQyLjMyIDEwNC42OCAxNzcuNjggNjkuMzIgMjkwLjM2IDE4MiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==";
        }
        else if (modelType === "output") {
            iconStr = model.type && model.type.type === "File" ||
                model.type.type === "array" ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDcuMzYgNDYyLjg2Ij48dGl0bGU+ZmlsZV9vdXRwdXQ8L3RpdGxlPjxnIGlkPSJMYXllcl8xMCIgZGF0YS1uYW1lPSJMYXllciAxMCI+PGcgaWQ9IkxheWVyXzlfY29weSIgZGF0YS1uYW1lPSJMYXllciA5IGNvcHkiPjxwb2x5Z29uIHBvaW50cz0iMjc0IDI5OC41IDI3NCA0MTIuODYgNTAgNDEyLjg2IDUwIDUwIDE5MC4zNSA1MCAyNzQgMTMzLjY1IDI3NCAxNjMuNSAzMjQgMTYzLjUgMzI0IDExMi45NCAyMTEuMDYgMCAyMTEuMDYgMCAwIDAgMCA0NjIuODYgMzI0IDQ2Mi44NiAzMjQgMjk4LjUgMjc0IDI5OC41Ii8+PC9nPjwvZz48ZyBpZD0iTGF5ZXJfNyIgZGF0YS1uYW1lPSJMYXllciA3Ij48cG9seWxpbmUgcG9pbnRzPSIzMjMuNzggMTM4Ljc2IDE4Ny45MyAxMzguMzggMTg3LjgxIDEzOC4zOCAxODcuODEgMS4wNiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NTBweCIvPjwvZz48ZyBpZD0iTGF5ZXJfMTEiIGRhdGEtbmFtZT0iTGF5ZXIgMTEiPjxwb2x5bGluZSBwb2ludHM9IjM3NiAzMjcgNDcyIDIzMSAzNzcgMTM2IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDo1MHB4Ii8+PGcgaWQ9IkxheWVyXzkiIGRhdGEtbmFtZT0iTGF5ZXIgOSI+PGxpbmUgeDE9IjIxNyIgeTE9IjIzMSIgeDI9IjQ3MiIgeTI9IjIzMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6NTBweCIvPjwvZz48L2c+PC9zdmc+" :
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAuMzYgMzY1Ij48dGl0bGU+dHlwZV9vdXRwdXQ8L3RpdGxlPjxnIGlkPSJvdXRwdXQiPjxwYXRoIGQ9Ik0yOTEuOTUsMzI1LjIzYTEzNCwxMzQsMCwwLDEtMTUuNzYsMTksMTMyLjUsMTMyLjUsMCwxLDEsMC0xODcuMzgsMTMzLjksMTMzLjksMCwwLDEsMTYuMTYsMTkuNTVsMzUuODEtMzUuODFBMTgyLjUsMTgyLjUsMCwxLDAsMzI3LjczLDM2MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTY4KSIvPjxnIGlkPSJjaXJjbGVfc291cmNlX2NvcHkiIGRhdGEtbmFtZT0iY2lyY2xlIHNvdXJjZSBjb3B5Ij48ZyBpZD0iTGF5ZXJfMjJfY29weSIgZGF0YS1uYW1lPSJMYXllciAyMiBjb3B5Ij48ZyBpZD0iTGF5ZXJfOV9jb3B5XzUiIGRhdGEtbmFtZT0iTGF5ZXIgOSBjb3B5IDUiPjxwb2x5Z29uIHBvaW50cz0iNTAwLjM2IDE4MiAzODYuNjggMjk1LjY4IDM1MS4zMiAyNjAuMzIgNDA0LjY0IDIwNyAyMTAgMjA3IDIxMCAxNTcgNDA0LjY0IDE1NyAzNTIuMzIgMTA0LjY4IDM4Ny42OCA2OS4zMiA1MDAuMzYgMTgyIi8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==";
        }

        if (!modelType.length || !iconStr.length) {
            return "";
        }

        // return `
        //              <g class="icon icon-${iconStr}">
        //              </g>
        //         `;

        return `
                    <image x="-10" y="-10" width="20" height="20" xlink:href="${iconStr}"></image>
                `;

    }

    static makeTemplate(x: number, y: number, dataModel: NodeDataModel): string {

        let nodeTypeClass = "step";
        if (dataModel instanceof WorkflowInputParameterModel) {
            nodeTypeClass = "input";
        } else if (dataModel instanceof WorkflowOutputParameterModel) {
            nodeTypeClass = "output";
        }

        const inputPortTemplates = (dataModel.in || [])
            .filter(p => p.isVisible)
            .sort((a, b) => -a.id.localeCompare(b.id))
            .map((p, i, arr) => GraphNode.makePortTemplate(
                p,
                "input",
                GraphNode.createPortMatrix(arr.length, i, GraphNode.radius, "input").toString()
            ))
            .reduce((acc, tpl) => acc + tpl, "");

        const outputPortTemplates = (dataModel.out || [])
            .filter(p => p.isVisible)
            .sort((a, b) => -a.id.localeCompare(b.id))
            .map((p, i, arr) => GraphNode.makePortTemplate(
                p,
                "output",
                GraphNode.createPortMatrix(arr.length, i, GraphNode.radius, "output").toString()
            ))
            .reduce((acc, tpl) => acc + tpl, "");

        return `
            <g tabindex="-1" class="node ${dataModel.id} ${nodeTypeClass}"
               data-connection-id="${dataModel.connectionId}"
               transform="matrix(1, 0, 0, 1, ${x}, ${y})"
               data-id="${dataModel.id}">
                <g class="drag-handle" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <circle cx="0" cy="0" r="${GraphNode.radius}" class="outer"></circle>
                    <circle cx="0" cy="0" r="${GraphNode.radius * .75}" class="inner"></circle>
                    ${GraphNode.makeIconFragment(dataModel)}
                </g>
                <text transform="matrix(1,0,0,1,0,${GraphNode.radius + 30})" class="title label">${dataModel.label || dataModel.id}</text>
                ${inputPortTemplates}
                ${outputPortTemplates}
            </g>
        `;
    }

    public draw(): Snap.Element {

        console.log("Drawing snap el");
        this.group.transform(new Snap.Matrix().translate(this.position.x, this.position.y));

        let iconFragment = ``;

        if (this.dataModel instanceof StepModel) {

            if (this.dataModel.run.class == "CommandLineTool") {

                iconFragment = `
                    <g class="icon icon-tool">
                        <path d="M 0 10 h 15"></path>
                        <path d="M -10 10 L 0 0 L -10 -10"></path>
                    </g>
                `;

            } else if (this.dataModel.run.class === "Workflow") {
                iconFragment = `
                    <g class="icon icon-workflow">
                        <circle cx="-8" cy="10" r="3"></circle>
                        <circle cx="12" cy="0" r="3"></circle>
                        <circle cx="-8" cy="-10" r="3"></circle>
                        <line x1="-8" y1="10" x2="12" y2="0"></line>
                        <line x1="-8" y1="-10" x2="12" y2="0"></line>
                    </g>
                `;
            }
        }

        this.group.add(Snap.parse(`
            <g class="drag-handle" transform="matrix(1, 0, 0, 1, 0, 0)">
                <circle cx="0" cy="0" r="${GraphNode.radius}" class="outer"></circle>
                <circle cx="0" cy="0" r="${GraphNode.radius * .8}" class="inner"></circle>
                ${iconFragment}
            </g>
            <text transform="matrix(1,0,0,1,0,${GraphNode.radius + 30})" class="label">${this.dataModel.label || this.dataModel.id}</text>
        `));

        // this.attachEventListeners(this.circleGroup);

        return this.group;
    }

    private static makePortTemplate(port: {
                                        label?: string,
                                        id: string,
                                        connectionId: string
                                    }, type: "input" | "output",
                                    transform = "matrix(1, 0, 0, 1, 0, 0)"): string {

        const portClass = type === "input" ? "input-port" : "output-port";
        const label = port.label || port.id;
        const template = `
            <g class="port ${portClass} ${port.id}" transform="${transform || 'matrix(1, 0, 0, 1, 0, 0)'}"
               data-connection-id="${port.connectionId}"
               data-port-id="${port.id}"
            >
                <g class="io-port ${port.id}">
                    <circle cx="0" cy="0" r="7" class="port-handle"></circle>
                </g>
                <text x="0" y="0" transform="matrix(1,0,0,1,0,0)" class="label unselectable">${label}</text>
            </g>
            
        `;

        return template;
    }

    public addPort(port: OutputPort | InputPort): void {

        const template = GraphNode.makePortTemplate(port);

        this.group.add(Snap.parse(template));

        // Ports should be sorted in reverse to comply with the SBG platform's coordinate positioning
        // portStore = portStore.sort((a, b) => -a.portModel.id.localeCompare(b.portModel.id));

        this.distributePorts();
        // if (portStore.length > 6 && portStore.length <= 20) {
        //
        //     const [a, b] = portStore.slice(-2).map(i => i.group.getBBox());
        //     const overlapping = a.y + a.height >= b.y;
        //     if (overlapping) {
        //         this.scale(1.08);
        //         this.distributePorts();
        //     }
        // }
    }

    /**
     * Moves the element to the outer edge of the node given an angle and the node radius
     * @param el Element to move
     * @param angle Angle along which the element should be moved
     * @param radius Radius of the parent node
     */
    private static movePortToOuterEdge(el: Snap.Element, angle: number, radius: number) {
        el // Remove previous transformations, bring it to the center
            .transform(new Snap.Matrix()
                // Then rotate it to a necessary degree
                    .rotate(angle, 0, 0)
                    // And translate it to the border of the circle
                    .translate(radius, 0)
                    // Then rotate it back
                    .rotate(-angle, 0, 0)
            );
    }

    /**
     * Repositions input and output ports to their designated places on the outer edge
     * of the node and scales the node in the process if necessary.
     */
    public distributePorts() {

        const outputs = Array.from(this.group.node.querySelectorAll(".output-port")).map(p => Snap(p));
        const inputs = Array.from(this.group.node.querySelectorAll(".input-port")).map(p => Snap(p));

        const availableAngle = 140;
        let rotationAngle;

        // Distribute output ports
        for (let i = 0; i < outputs.length; i++) {
            rotationAngle =
                // Starting rotation angle
                (-availableAngle / 2) +
                (
                    // Angular offset by element index
                    (i + 1)
                    // Angle between elements
                    * availableAngle / (outputs.length + 1)
                );

            GraphNode.movePortToOuterEdge(outputs[i], rotationAngle, GraphNode.radius);
        }

        // Distribute input ports
        for (let i = 0; i < inputs.length; i++) {
            rotationAngle =
                // Determines the starting rotation angle
                180 - (availableAngle / -2)
                // Determines the angular offset modifier for the current index
                - (i + 1)
                // Determines the angular offset
                * availableAngle / (inputs.length + 1);

            GraphNode.movePortToOuterEdge(inputs[i], rotationAngle, GraphNode.radius);
        }
    }

    public static createPortMatrix(totalPortLength: number,
                                   portIndex: number,
                                   radius: number,
                                   type: "input" | "output"): Snap.Matrix {
        const availableAngle = 140;

        let rotationAngle =
            // Starting rotation angle
            (-availableAngle / 2) +
            (
                // Angular offset by element index
                (portIndex + 1)
                // Angle between elements
                * availableAngle / (totalPortLength + 1)
            );

        if (type === "input") {
            rotationAngle =
                // Determines the starting rotation angle
                180 - (availableAngle / -2)
                // Determines the angular offset modifier for the current index
                - (portIndex + 1)
                // Determines the angular offset
                * availableAngle / (totalPortLength + 1);
        }

        return new Snap.Matrix()
            .rotate(rotationAngle, 0, 0)
            .translate(radius, 0)
            .rotate(-rotationAngle, 0, 0);
    }

    public static createGhostIO() {

        const ns = "http://www.w3.org/2000/svg";
        const node = document.createElementNS(ns, "g");
        node.setAttribute("transform", "matrix(1,0,0,1,0,0)");
        node.classList.add("ghost", "node");
        node.innerHTML = `
            <circle class="ghost-circle" cx="0" cy="0" r="${GraphNode.radius / 1.5}"></circle>
        `;
        return node;
    }

    static patchModelPorts<T>(model: T): T {
        const patch = [{connectionId: model.connectionId, isVisible: true, id: model.id}];
        if (model instanceof WorkflowInputParameterModel) {
            const copy = Object.create(model);
            return Object.assign(copy, {out: patch});


        } else if (model instanceof WorkflowOutputParameterModel) {
            const copy = Object.create(model);
            return Object.assign(copy, {in: patch});
        }

        return model;
    }

}