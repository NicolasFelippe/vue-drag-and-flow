<template>
    <component
      ref="node"
      :is="compModel"
      :obj="model"
      :width="width"
      :height="height"
      :icon="icon"
      :backgroundColorIcon="backgroundColorIcon"
      :topConnected="topConnected"
      :bottomConnected="bottomConnected"
      :status="status"
      :noStatus="noStatus"
      :start="start"
      :end="end"
      :condition="condition"
      :group="group"
      :color="color"
      :active="active"
      :iconOff="iconOff"
      :status-color="getStatusColor"
      @select="select"
      @endLink="endLink"
      @startLink="startLink"
      @drag="$emit('drag', $event)"
    />
</template>
<script>
import Losango from "../models/Losango.vue";
import Rectangle from "../models/Rectangle.vue";

export default {
  name: "BaseContent",
  components: {
    Losango,
    Rectangle,
  },
  props: {
    obj: {
      type: Object,
    },
    width: {
      type: String,
      default: "100px",
    },
    height: {
      type: String,
      default: "30px",
    },
    icon: {
      type: String,
      default: "icon",
    },
    backgroundColorIcon: {
      type: String,
      default: "#555",
    },
    topConnected: {
      type: Boolean,
    },
    bottomConnected: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    noStatus: {
      type: Boolean,
      default: false,
    },
    start: {
      type: Boolean,
      default: false,
    },
    end: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: Boolean,
      defalt: false,
    },
    group: {
      type: String,
    },
    color: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
    iconOff: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: this.obj,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0,
      sizeConnectors: 6,
    };
  },
  watch: {
    model: {
      handler() {
        this.$emit("input", this.model);
      },
      deep: true,
    },
  },
  computed: {
    compModel() {
      return this.type === "rectangle" ? Losango : Rectangle;
    },
    getStatusColor() {
      return !this.status
        ? "#424242"
        : this.status === "error"
        ? "#DE3E44"
        : "#1BA345";
    },
  },
  methods: {
    startLink(posFrom, obj) {
      console.log("posFrom", posFrom);
      console.log("obj", obj);
      console.log("document.startLinkId", document.startLinkId);
      this.model.links.push({ idFrom: obj.id, idTo: "", posFrom });
      document.startLinkId = obj.id;
      document.posFrom = posFrom;
      this.$emit("startLink", obj);
      this.$forceUpdate();
    },
    endLink(obj) {
      console.log("endlink", obj);
      console.log("document.startLinkId", document.startLinkId);
      this.$emit("endLink", document.startLinkId, obj.id, {
        idTo: obj.id,
        posTo: "top",
      });
    },
    setLink(link) {
      this.model.link = link;
    },
    select(obj) {
      this.$emit("select", obj);
      if (document.startLinkId !== obj.id) {
        this.endLink(obj);
      }
    },
  },
};
</script>