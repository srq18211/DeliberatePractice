<template>
    <svg class="circle-progress" viewBox="0,0,300,300" preserveAspectRatio="xMinYMin meet">
        <circle class="circle" :cx="cx" :cy="cy" :r="`${r}`" stroke="#eaeef2"></circle>
        <circle class="circle dasharray right" :cx="cx" :cy="cy" :r="`${r}`"
                :stroke-dasharray="`${totalLength } 99999`">
        </circle>
        <circle class="circle dasharray wrong" :cx="cx" :cy="cy" :r="`${r}`"
                :stroke-dasharray="`${wrongLength } 99999`">
        </circle>
        <text x="150" y="150"
              class="text">
            {{percentage}}
            <tspan font-size="35">%</tspan>
            <!--            {{total-totalV}}-->

        </text>
        <!--        <text x="150" y="180"-->
        <!--              text-anchor="middle"-->
        <!--              font-family="Verdana"-->
        <!--              fill="#9E9E9E"-->
        <!--              font-size="15"-->
        <!--              style="min-width:100px">-->
        <!--            <tspan font-size="10">-->
        <!--                已经完成:-->
        <!--            </tspan>-->
        <!--            {{totalV}}<tspan font-size="9">%</tspan>-->
        <!--        </text>-->
        <!--        <text x="150" y="200"-->
        <!--              text-anchor="middle"-->
        <!--              font-family="Verdana"-->
        <!--              fill="#9E9E9E"-->
        <!--              font-size="15"-->
        <!--              style="min-width:100px">-->
        <!--            <tspan font-size="10">-->
        <!--                完成比例:-->
        <!--            </tspan>-->
        <!--            {{percentage}}-->
        <!--            <tspan font-size="9">%</tspan>-->
        <!--        </text>-->
    </svg>
</template>
<script>
    export default {
        props: {
            right: {
                type: [Number],
                default: 0
            },
            wrong: {
                type: [Number],
                default: 0
            },
            total: {
                type: [Number],
                default: 0
            },
        },
        // watch: {
        //     min: function (v) {
        //         if (v > this.total) {
        //             this.totalV = this.total
        //         }
        //     }
        // },
        data() {
            return {
                cx: 150,
                cy: 150,
                r: 100,
                colors: [
                    "rgba(244,54,54,1)",
                    "rgba(139,195,74,1)",
                ]
            }
        },
        methods: {
            computedRatio(totalV, maxV) {
                let ratio = totalV / maxV || 0
                return ratio.toFixed(2)
            },
            computedLength(r, ratio) {
                return 2 * Math.PI * r * ratio
            }
        },
        computed: {
            ratio() {
                return this.computedRatio(this.totalV, this.total)
            },
            wrongRatio() {
                return this.computedRatio(this.wrongV, this.total)
            },
            percentage() {
                return Math.floor(this.ratio * 100)
            },
            wrongLength() {
                return this.computedLength(this.r, this.wrongRatio)
            },
            totalLength() {
                return this.computedLength(this.r, this.ratio)
            },
            totalV: {
                get: function f() {
                    return Math.min(this.right + this.wrong, this.total)
                }
            },
            wrongV: {
                get: function f() {
                    return Math.min(this.wrong, this.total - this.right)
                }
            }
        }
    }
</script>
<style lang="scss">
    .circle {
        fill: none;
        stroke-width: 20px;
    }

    .text {
        font-size: 50px;
        text-anchor:middle;
        dominant-baseline: middle; /* 文本垂直居中 */
        font-family:fantasy;
    }

    .dasharray {
        transform-origin: center;
        transform: rotate(-90deg);
        transition: all 0.3s;
    }

    .right {
        stroke: #36cfc9;
    }

    .wrong {
        stroke: #cf3636;

        &:hover {
            cursor: pointer;
            stroke-width: 17px;
        }
    }
</style>