<template>
  <div class="hello container">
    <h1>{{ msg }}</h1>
    <h2>Liste des questions fréquentes :</h2>
      <ul class="collection">
        <li v-for="item in faq" class="collection-item col s12">
          <p><i class="material-icons">mode_comment</i> {{item.question}}</p>
          <p><i class="material-icons">grade</i> Réponse : {{item.reponse}}</p>
          <a @click="remove(item.id)" class="btn delete">Supprimer</a>
        </li>
      </ul>
    <h2>Ajouter une nouvelle faq</h2>
      <form>
        <div class="row">
				  <div class="col s12 input-field">
            <p><i class="material-icons prefix">mode_comment</i><input id="question" v-validate="'min:8|max:300'" type="text" name="question" value="" :class="{'input': true, 'is-danger': errors.has('reponse') }" v-model="newFaq.question"><span v-show="errors.has('question')" class="help is-danger">{{ errors.first('question') }}</span><label for="question">Formuler la question</label></p>
            </div>
        </div>
        <div class="row">
				  <div class="col s12 input-field">
            <p><i class="material-icons prefix">grade</i><input id="reponse" v-validate="'min:4'" type="text" name="reponse" value="" :class="{'input': true, 'is-danger': errors.has('reponse') }" v-model="newFaq.reponse"><span v-show="errors.has('reponse')" class="help is-danger">{{ errors.first('reponse') }}</span><label for="reponse">Donner la réponse</label></p>
          </div>
        </div>
        <a @click="add" class="btn">Ajouter cette faq</a>
        <!--<button @click="add" type="button">Ajouter cette faq</button>-->
      </form>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      faq: [],
      newFaq: {
        question:'',
        reponse:'',
        enable:''
      },
      msg: 'Welcome to GOT faq!'
    }
  },
  created(){
    this.$http.get('http://localhost:3000').then((res) => {
      this.faq = res.body;

    })
  },
  methods: {
    add(){
      this.$http.post('http://localhost:3000/newFaq', this.newFaq).then((res) => {
        this.faq = res.body;

        this.newFaq = {
          question:'',
          reponse:'',
          enable: null
        };

      })


    },
    remove(id){
      this.$http.get(`http://localhost:3000/remove/${id}`).then((res) => {
        this.faq = res.body;

      });

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

h1 {
  font-size: 3em;
  color:darkgoldenrod;
}

h2 {
  font-size: 1.5em;
  padding-top:50px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
  width:100%;
}

.hello {
  margin-bottom: 50px;
}

.delete {
  color:red;
  background-color: white;
  font-size:10px;
  font-weight: bold
}

.is-danger {
  border-color: red;
}
</style>
