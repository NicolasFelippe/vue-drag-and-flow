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
    @drag="setDrag($event)"
  />
</template>
<script>
import CompLosango from "../models/Losango.vue";
import CompRectangle from "../models/Rectangle.vue";
import CompCircle from "../models/Circle.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BaseContent",
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
  mounted () {
    this.$refs.node.$el.onmousedown = this.dragMouseDown;
    this.$refs.node.$el.ontouchstart = this.dragMouseDown;
  },
  computed: {
    ...mapGetters('flow', ['getEndLink', 'getStartLink']),
    compModel() {
      switch (this.type.toLowerCase()) {
        case "rectangle":
          return CompRectangle;
        case "losango":
          return CompLosango;
        case "circle":
          return CompCircle;
        default:
          return CompRectangle
      }
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
    ...mapActions('flow', ['saveStart', 'saveEnd', 'saveDrag']),
    dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      this.pos3 = e.clientX;
      this.pos4 = e.clientY;

      // this.$refs.node.$el.addEventListener('onmouseup', this.closeDragElement)
      // this.$refs.node.$el.addEventListener('onmousemove', this.elementDrag)
      // this.$refs.node.$el.addEventListener('ontouchend', this.closeDragElement)
      // this.$refs.node.$el.addEventListener('ontouchmove', this.elementDrag)
       this.$refs.node.$el.onmouseup = this.closeDragElement;
       this.$refs.node.$el.onmousemove = this.elementDrag;

       this.$refs.node.$el.ontouchend = this.closeDragElement;
       this.$refs.node.$el.ontouchmove = this.elementDrag;
      this.$emit("drag", this.obj);
    },
    elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      if (e.clientX) {
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
      } else {
        this.pos1 = this.pos3 - event.changedTouches[0].clientX;
        this.pos2 = this.pos4 - event.changedTouches[0].clientY;
        this.pos3 = event.changedTouches[0].clientX;
        this.pos4 = event.changedTouches[0].clientY;
      }
      this.obj.x = this.$refs.node.$el.offsetTop - this.pos2;
      this.obj.y = this.$refs.node.$el.offsetLeft - this.pos1;
      this.$refs.node.$el.style.top = this.obj.x + "px";
      this.$refs.node.$el.style.left = this.obj.y + "px";
    },
    closeDragElement() {
      this.$refs.node.$el.onmouseup = null;
      this.$refs.node.$el.onmousemove = null;
      this.$refs.node.$el.ontouchend = null;
      this.$refs.node.$el.ontouchmove = null;
      this.$emit("drag", false);
    },
    setDrag(val){
      this.saveDrag(val)
    },
    startLink(position, obj) {
      this.saveStart({ ...this.obj, position})
      this.model.links.push({ idFrom: obj.id, idTo: "", posFrom: position });
      document.startLinkId = obj.id;
      document.posFrom = position;
      this.$emit("startLink", obj);
      this.$forceUpdate();
    },
    endLink(obj, position) {
      this.saveEnd({ ...this.obj, position})
      this.$emit("endLink", document.startLinkId, obj.id, {
        idTo: obj.id,
        posTo: position || 'top',
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