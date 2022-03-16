<template>
  <div class="home">

    <div class="haeder">
      <div class="title">E.P.C.P</div>
      <img id="git" src="../Img/git.png" alt="git이미지" @click="linkGit">
      <div class="tip">
        <img src="../Img/tip.png" alt="팁이미지" @mouseenter="viewTip(true)" @mouseleave="viewTip(false)">
        <span id="tiptxt">use) 변경할 수치를 입력 후 저장</span>
      </div>
      <select name="tags" id="tagList" @change='test($event)'>
        <option v-for="(i,index) in 3" :key="index" :value="(index+1)+'번 태그'">{{i}}번 태그</option>
      </select>
    </div>

    <div class="body">
      <table id="itemtable">
        <thead>
            <tr align = "center">
              <th>No.</th>
              <th>Equipment Name</th>
              <th>Position(x)</th>
              <th>Position(y)</th>
              <th>Position(z)</th>
              <th></th>
            </tr>
        </thead>
        <tbody>
          <template v-for="(i,index) in itemList">
            <tr class="tbody" :id="'back'+index" align="center" height="50px" v-if="!setStateValue[index].divtag" :key="index">
              <td class="iindex"><div>{{i.no}}</div></td>
              <td class="iname"><div>{{i.objname}}</div></td>
              <td class="pos iposx"><input type="number" :readonly="true" :value="reviseState[index]? 0:i.posx" ></td>
              <td class="pos iposy"><input type="number" :readonly="true" :value="reviseState[index]? 0:i.posy"></td>
              <td class="pos iposz"><input type="number" :readonly="true" :value="reviseState[index]? 0:i.posz"></td>
              <td>
                <button :id="'reBtn'+index" class="reBtn" @click="onRevise(index)" v-if="!setStateValue[index].state" :disabled="btnsetState[index]"><img src="../Img/re.png" alt="수정 버튼"></button>
                <div class="seBtns" v-if="setStateValue[index].state">
                  <button @click="onSave(index, i.objname)"><img src="../Img/sa.png" alt="저장 버튼"></button>
                  <button @click="onCancle(index)"><img src="../Img/ca.png" alt="취소 버튼"></button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>Copyright © beginner developer Ayumu.</span>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "Home",
  components: {
  },
  mounted(){
    this.loadItem();
  },
  data(){
    return{
      err:false,
      setStateValue:[],
      itemList:[],
      btnsetState:[],
      reviseState:[],
    }
  },
  methods:{
    loadItem(){
      axios.get(`http://127.0.0.1:3000/load`)
      .then((response) => {
        this.itemList = response.data.data;
        for(let i=0; i<this.itemList.length;i++){
          this.$set(this.setStateValue,i,{state:false, divtag:false});
          this.btnsetState.push(false);
          this.reviseState.push(false);
        }
        this.itemList =  this.itemList.sort((a,b)=>{return a.no - b.no});
        for(let i=0; i<this.itemList.length;i++){
          if(this.itemList[i].tagno == 1) this.setStateValue[i].divtag = false;
          else this.setStateValue[i].divtag = true;
        }
      });
    },
    viewTip(bool){
      if(bool) document.getElementById("tiptxt").style.opacity="1";
      else document.getElementById("tiptxt").style.opacity="0";
      document.getElementById("tiptxt").style.transition="all .8s"
    },
    linkGit(){
      window.open('https://github.com/lunilun/revise')
    },
    onRevise(i){
      this.$set(this.reviseState,i,true);
      for(let n=0; n<this.btnsetState.length;n++){
        if(n!=i) {
          this.$set(this.btnsetState,n,true);
          if(document.getElementById(`reBtn${n}`)!=null) document.getElementById(`reBtn${n}`).style.opacity='0.3';
        }
      }

      const backEl = document.getElementById(`back${i}`);
      this.setReadOnly(backEl,false,i);
    },
    onCancle(i){
      this.$set(this.reviseState,i,false);
      for(let n=0; n<this.btnsetState.length;n++){
        this.$set(this.btnsetState,n,false)
        if(document.getElementById(`reBtn${n}`)!=null) document.getElementById(`reBtn${n}`).style.opacity='1';
      }
      const backEl = document.getElementById(`back${i}`);
      this.setReadOnly(backEl,true,i);
    },
    setReadOnly(obj,bool,i){
      this.setStateValue[i].state = !bool;
      for(let i=0; i<obj.childNodes.length;i++){
        const child = obj.childNodes[i];
        if(child.childNodes[0].nodeName == "INPUT") {
          child.childNodes[0].readOnly=bool;
          if(!bool) {
            child.style.background= 'black';
            child.childNodes[0].style.color= 'white';
          }
          else{
            child.style.background= 'white';
            child.childNodes[0].style.color= 'black';
          }
        }
      }
    },
    onSave(i,name){
      const backEl = document.getElementById(`back${i}`);
      const saveData = [];

      for(let i=0; i<backEl.childNodes.length;i++){
        if(backEl.childNodes[i].childNodes[0].nodeName == "INPUT") {
          if(
            ((backEl.childNodes[i].childNodes[0].value.split('')[0]=='0' && backEl.childNodes[i].childNodes[0].value.split('')[1]!='.') ||
            (backEl.childNodes[i].childNodes[0].value.split('')[0]=='-' && backEl.childNodes[i].childNodes[0].value.split('')[1]=='0' && backEl.childNodes[i].childNodes[0].value.split('')[2]!='.')) &&
            backEl.childNodes[i].childNodes[0].value.split('').length == 0) this.err=true;

          saveData.push(backEl.childNodes[i].childNodes[0].value)
        }
      }
      const saveX = Number(this.itemList[i].posx) + Number(saveData[0]);
      const saveY = Number(this.itemList[i].posy) + Number(saveData[1]);
      const saveZ = Number(this.itemList[i].posz) + Number(saveData[2]);

      if(this.err==true) {
        alert("위치 단위가 잘못되었습니다.");
        window.location.reload();
      }
      else if(saveData[0].length >6 || saveData[1].length >6 || saveData[2].length >6) alert("입력값은 최대 6자리입니다.")
      else{
        axios.post(`http://127.0.0.1:3000/save`, {name:name,posx:String(saveX),posy:String(saveY),posz:String(saveZ)})
        .then((response) => {
          console.log(response.data);
          if(response.data=="save"){
            alert("위치가 수정되었습니다.");
            window.location.reload();
          }else{
            alert("위치변경에 실패하였습니다.");
            window.location.reload();
          }
        });
      }
    },
    test(e){
      const tag = e.target.value.replace("번 태그","");
      for(let i=0; i<this.itemList.length;i++){
        if(this.itemList[i].tagno == Number(tag)) this.setStateValue[i].divtag = false;
        else this.setStateValue[i].divtag = true;
      }
    }
  },
};
</script>

<style scoped lang="scss">
@import '@/scss/base.scss';
@import '@/scss/home.scss';
</style>
