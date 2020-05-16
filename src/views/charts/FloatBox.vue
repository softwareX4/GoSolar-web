<template>
    <div className="float-card" id="boxPos"  v-show="visible">
        <div className="box is-unselectable">
            <h4 className="name" v-model="info.name">

            </h4>

            <div v-show="isPackage">
            <b>Lines: </b>
            <span v-model="info.loc">{info.NOL}</span>
            <br />
            <b>Methods: </b>
            <span v-model="info.methods">{info.NOM}</span>
            <br />
            <b>Attributes: </b>
            <span v-model="info.attr">{info.NOA}</span>
            <br />
            </div>
        </div>
    </div>
</template>

<script>

    import Util from '../../common/js/util'
    export default {
        name: "floatbox",
        props: {
                position:{}, info:{}, visible:false,
        },
        data() {

            return {
                isPackage:true,
            }


        },
        created(){

        },

        methods: {
            setBoxPosition:function() {
                document.getElementById("boxPos").style.left= this.position.x;
                document.getElementById("boxPos").style.top= this.position.y;

            },
            init(){
                if(this.state.info.type !== Util.TYPE.P){
                    this.isPackage = false;
                }
                else {
                    this.isPackage = true;
                }
            }

        },
        mounted() {
            this.init();
            this.setBoxPosition();
        }
    }
</script>

<style scoped>

    .float-card {
        position: fixed;
    }

    @media (max-width: 500px) {
        .float-card {
            display: none;
        }
    }

</style>