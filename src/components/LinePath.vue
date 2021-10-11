<template>
  <path
    v-if="fromElement && toElement"
    :stroke-dasharray="dasharray"
    :d="`${mountPath()}`"
    :stroke="color"
    :stroke-width="lineWidth"
    fill="none"
    class="selected"
    marker-end="url(#triangle)"
  />
</template>

<script>
const CURV = 4;
const UP_TO_DOWN_RIGHT = `a${CURV},${CURV} -90 0 0 ${CURV},${CURV}`;
const UP_TO_DOWN_LEFT = `a${CURV},${CURV} 0 0 1 -${CURV},${CURV}`;
const DOWN_TO_UP_RIGHT = `a${CURV},${CURV} 0 0 1 ${CURV},-${CURV}`;
const DOWN_TO_UP_LEFT = `a${CURV},${CURV} -90 0 0 -${CURV},-${CURV}`;
const LEFT_TO_RIGHT_DOWN = `a${CURV},${CURV} 0 0 1 ${CURV},${CURV}`;
const LEFT_TO_RIGHT_UP = `a${CURV},${CURV} -90 0 0 ${CURV},-${CURV}`;
const RIGHT_TO_LEFT_DOWN = `a${CURV},${CURV} 90 0 0 -${CURV},${CURV}`;
const RIGHT_TO_LEFT_UP = `a${CURV},${CURV} 90 0 1 -${CURV},-${CURV}`;

export default {
  props: {
    from: {
      type: Object,
    },
    to: {
      type: Object,
    },
    color: {
      type: String,
      default: "#fff",
    },
    dasharray: {
      type: String,
      default: "0,0",
    },
    lineWidth: {
      type: String,
      default: "1",
    },
    group: {
      type: String,
    },
  },
  data() {
    return {
      fromElement: null,
      toElement: null,
      isLosango: false,
      isBottomNo: false,
      isBottomYes: false,
    };
  },
  mounted() {
    this.fromElement = {};
    this.toElement = {};
    this.update();
  },
  methods: {
    update() {
      // TODO: check null
      this.fromElement = {};
      if (this.from.node) {
        /*
        this.fromElement.y1 = (document.getElementById(this.from.node.id + this.from.pos).offsetTop + document.getElementById(this.from.node.id + this.from.pos).parentElement.offsetTop + document.getElementById(this.from.node.id + this.from.pos).parentElement.parentElement.offsetTop)
        this.fromElement.x1 = (document.getElementById(this.from.node.id + this.from.pos).offsetLeft + document.getElementById(this.from.node.id + this.from.pos).parentElement.offsetLeft + document.getElementById(this.from.node.id + this.from.pos).parentElement.parentElement.offsetLeft)
        */

        let positionFrom = this.getRecursiveParentUntilProperty(
          this.from,
          "className",
          "node"
        );
        this.fromElement.y1 = positionFrom.y;
        this.fromElement.x1 = positionFrom.x;
        this.fromElement.el = document.getElementById(this.from.node.id);
        this.fromElement.id = this.from.node.id;
      }
      // TODO: check null
      if (this.to.node) {
        let positionTo = this.getRecursiveParentUntilProperty(
          this.to,
          "className",
          "node"
        );
        this.toElement.y2 = positionTo.y;
        this.toElement.x2 = positionTo.x;
        this.toElement.el = document.getElementById(this.to.node.id);
        this.toElement.id = this.to.node.id;
      } else {
        let value = this.getRecursiveParentUntilProperty(
          {
            node: {
              id: "drop-area" + this.group,
            },
            pos: "",
          },
          "id",
          "app"
        );
        this.toElement.y2 = event.pageY - value.y;
        this.toElement.x2 = event.pageX - value.x;
        this.toElement.el = { clientWidth: 100 };
        document.onmousemove = this.handleMouseMove;
      }
      this.$forceUpdate();
    },
    getRecursiveParentUntilProperty(object, property, value) {
      let result = { y: 0, x: 0 };
      let dotTop = null;
      this.isLosango = false;
      const elementId = object.node.id + object.pos;
      let element = document.getElementById(elementId);
      this.isBottomNo = object.pos === "bottomNo";
      this.isBottomYes = object.pos === "bottomYes";
      if (!this.isBottomNo && !this.isBottomYes) {
        dotTop = document.getElementById(object.node.id + "top-losango");
      }
      if (dotTop) {
        this.isLosango = true;
        element = dotTop;
      }
      do {
        const plusTop = this.isLosango ? 12 : 2;
        let plusLeft = this.isBottomNo ? -19 : this.isBottomYes ? -7 : 0;
        result.y += element.offsetTop - plusTop;
        result.x += element.offsetLeft - plusLeft;
        element = element.offsetParent;
      } while (element && element[property].includes(value));
      return result;
    },
    handleMouseMove(event) {
      let eventDoc, doc, body;
      event = event || window.event;
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          ((doc && doc.clientTop) || (body && body.clientTop) || 0);
      }

      let value = this.getRecursiveParentUntilProperty(
        {
          node: {
            id: "drop-area" + this.group,
          },
          pos: "",
        },
        "id",
        "app"
      );
      this.toElement.y2 = event.pageY - value.y;
      this.toElement.x2 = event.pageX - value.x;
      this.toElement.el = { clientWidth: 100 };
      this.toElement.id = null;
      this.update();
    },
    getLineHorizontalSize() {
      const valueOn = this.isLosango ? -40 : 7;
      const valueOff = this.isLosango ? -47 : 1;
      return this.toElement.x2 + (this.isLeftToRight() ? valueOn : valueOff);
    },
    isLeftToRight() {
      return this.fromElement.x1 > this.toElement.x2;
    },
    getBreakOne() {
      return this.isLeftToRight() ? UP_TO_DOWN_LEFT : UP_TO_DOWN_RIGHT;
    },
    getBreakTwo() {
      return this.isLeftToRight() ? RIGHT_TO_LEFT_DOWN : LEFT_TO_RIGHT_DOWN;
    },
    getBreakOfBreakOne() {
      return this.isLeftToRight() ? RIGHT_TO_LEFT_UP : LEFT_TO_RIGHT_UP;
    },
    getBreakOfBreakTwo() {
      return this.isLeftToRight() ? DOWN_TO_UP_LEFT : DOWN_TO_UP_RIGHT;
    },
    getLineVerticalSize() {
      return (
        this.fromElement.y1 + (this.toElement.y2 - this.fromElement.y1) / 2
      );
    },
    mountPath() {
      /*
      if (!this.from.node || !this.to.node) {
        return ''
      }
      */
      let coefSize = 10;
      if (this.fromElement.id === this.toElement.id) {
        return `
          M ${this.fromElement.x1 + 3},${this.fromElement.y1}
          V${this.fromElement.y1 + coefSize}
          ${UP_TO_DOWN_RIGHT}

          H${
            this.getLineHorizontalSize() +
            this.fromElement.el.clientWidth / 2 +
            coefSize
          } 

          ${LEFT_TO_RIGHT_UP}
          V${this.toElement.y2 - coefSize}

          ${DOWN_TO_UP_LEFT}
          H${this.getLineHorizontalSize() + 8} 

          ${RIGHT_TO_LEFT_DOWN}
          V${this.toElement.y2 - 5}
          `;
      } else if (this.toElement.y2 - this.fromElement.y1 > 20) {
        const t = this.isBottomYes ? 300 : 3;
        return `
          M ${this.fromElement.x1 + t},${this.fromElement.y1 - 10} 
          V${this.getLineVerticalSize()} 
          ${this.getBreakOne()} 
          H${this.getLineHorizontalSize()} 
          ${
            this.toElement.y2 - this.fromElement.y1 > 20
              ? this.getBreakTwo()
              : ""
          } 
          ${
            this.toElement.y2 - this.fromElement.y1 > 25
              ? "V" + (this.toElement.y2 - 5)
              : ""
          }
          `;
      } else {
        let sizeParam = 0;
        if (this.toElement.el) {
          sizeParam =
            this.toElement.el.clientWidth / this.fromElement.el.clientWidth;
        }
        return `
          M ${this.fromElement.x1 + 3},${this.fromElement.y1}
          V${this.fromElement.y1 + coefSize}
          ${this.getBreakOne()}

          H${
            (this.getLineHorizontalSize() - this.fromElement.x1) /
              (1 + sizeParam) +
            this.fromElement.x1
          } 

          ${this.getBreakOfBreakOne()}
          V${this.toElement.y2 - coefSize}

          ${this.getBreakOfBreakTwo()}
          H${this.getLineHorizontalSize()} 

          ${this.getBreakTwo()}
          V${this.toElement.y2 - 5}
          `;
      }
    },
  },
  watch: {
    from: {
      handler() {
        this.update();
      },
      deep: true,
    },
    to: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>