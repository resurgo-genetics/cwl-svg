export class Geometry {

    static distance(x1, y1, x2, y2) {

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    static getTransformToElement(from, to) {
        const getPosition = (node: SVGGElement, addE = 0, addF = 0): SVGMatrix => {

            if (!node.ownerSVGElement) {
                // node is the root svg element
                const matrix = (node as SVGSVGElement).createSVGMatrix();
                matrix.e = addE;
                matrix.f = addF;
                return matrix;
            } else {
                // node still has parent elements
                const {e, f} = node.transform.baseVal.getItem(0).matrix;

                return getPosition(<SVGGElement>node.parentNode, e + addE, f + addF);
            }
        };

        const toPosition = getPosition(to);
        const fromPosition = getPosition(from);

        const result = from.ownerSVGElement.createSVGMatrix();
        result.e = toPosition.e - fromPosition.e;
        result.f = toPosition.f - fromPosition.f;

        return result.inverse();
    }
}