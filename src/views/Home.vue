<template>
  <NavMenu :user-status="userStatus"></NavMenu>
  <div class="background-image-blur-whitewash"></div>
  <div class="main">
    <aside id="aside-filters">
      <p>Filters</p>
      <div class="line"></div>
      <div class="filter">
        <span>Strength</span>
        <div class="filter-box" data-attr="strength">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
      <div class="filter">
        <span>Speed</span>
        <div class="filter-box" data-attr="speed">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
      <div class="filter">
        <span>Skill</span>
        <div class="filter-box" data-attr="skill">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
      <div class="filter">
        <span>Fear Factor</span>
        <div class="filter-box" data-attr="fear_factor">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
      <div class="filter">
        <span>Power</span>
        <div class="filter-box" data-attr="power">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
      <div class="filter">
        <span>Intelligence</span>
        <div class="filter-box" data-attr="intelligence">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
      <div class="filter">
        <span>Wealth</span>
        <div class="filter-box" data-attr="wealth">
          <div class="filter-line"></div>
          <div class="filter-inner-line"></div>
          <div class="filter-button filter-button-1">0</div>
          <div class="filter-button filter-button-2">100</div>
        </div>
      </div>
    </aside>

    <section id="sec-table">
      <form id="search-form">
        <input id="search-input" type="text" placeholder="Search characters">
        <table id="character-table" @click="handleTableRowClick">
          <thead>
          <tr>
            <th>Name</th>
            <th>Strength</th>
            <th>Speed</th>
            <th>Skill</th>
            <th>Fear Factor</th>
            <th>Power</th>
            <th>Intelligence</th>
            <th>Wealth</th>
            <th>Selected</th>
          </tr>
          </thead>
          <tbody>
          <!-- insert a row for each character here using javascript-->
          </tbody>
        </table>
      </form>
    </section>
    <aside id="aside-pc">
      <p>Previous Comparisons</p>
      <div class="line"></div>
      <div class="pc-box">
      </div>
    </aside>
  </div>

  <section id="sec-comp">
    <div></div>
    <div></div>
    <div class="character character-0">
      <div class="name">Unknown</div>
      <div class="pfp">?</div>
    </div>
    <div class="vs">VS</div>
    <div class="character character-1">
      <div class="name">Unknown</div>
      <div class="pfp">?</div>
    </div>
    <div></div>
    <div></div>
  </section>


  <!-- this section will show the result of comparison-->
  <section id="sec-result">
    <div class="board">
      <div class="board-0">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="attr">
        <div>STRENGTH</div>
        <div>SPEED</div>
        <div>SKILL</div>
        <div>FEAR</div>
        <div>POWER</div>
        <div>INTELLIGENCE</div>
        <div>WEALTH</div>
      </div>
      <div class="board-1">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import NavMenu from "../components/NavMenu.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {NavMenu},
  data() {
    return {
      characterList: [],
      previousCompArr: [],
      board_1: undefined,
      board_2: undefined,
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      isLoaded: false,
    }
  },
  mounted() {
    this.characterList = [];
    this.previousCompArr = [];
    this.board_1 = undefined;
    this.board_2 = undefined;
    this.user = null;
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isLoaded = false;


    window.charsArr = []

    this.board = document.querySelector(".board")
    this.board_1 = this.board.querySelector(".board-0")
    this.board_2 = this.board.querySelector(".board-1")
    axios.get('/characters')
        .then(response => {
          console.log(window.charsArr)

          this.characterList = response.data
          this.loadCharacters()
          this.loadPreCom()


          if (!window.hasListener) {
            /**
             * select and unselect the characters through the checkboxes
             */
            this.selectCharacters()

            /**
             * after clicking a record in Previous Comparison box, 2 characters will be compared
             */
            this.bindPCEvent()
          }


          // listening to searches
          document.getElementById("search-input").addEventListener("input", this.processSearch);

          //drag filter button
          this.dragFilterButton()

        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.isLoggedIn = true
      this.isAdmin = this.user.isAdmin
    }
  },
  methods: {
    handleTableRowClick(event) {
      if (event.target.classList.contains('home-character-name')) {
        const id = event.target.dataset.id;
        if (this.isLoggedIn) {
          this.$router.push({name: 'CharacterDetail', params: {id: id}})
        } else {
          this.$message({
            message: 'Please log in your account first~',
            type: 'error'
          });
        }
      }
    },
    loadCharacters() {
      let list = this.characterList
      let html = ``
      list.forEach((character, i) => {
        if (character.active) {
          html += `
            <tr data-id="${i}">
                <td class="home-character-name" data-id="${character._id}">${character.name}</el-link></td>
                <td>${character.strength}</td>
                <td>${character.speed}</td>
                <td>${character.skill}</td>
                <td>${character.fear_factor}</td>
                <td>${character.power}</td>
                <td>${character.intelligence}</td>
                <td>${character.wealth}</td>
                <td><div class="checkbox"><span><svg t="1709959345452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1599"><path d="M155.644361 439.225533 376.468722 660.086733l486.86146-490.229161 95.379301 95.352695-585.574692 588.933183L65.289494 546.298154 155.644361 439.225533 155.644361 439.225533zM155.644361 439.225533" fill="#272636" p-id="1600"></path></svg></span></div></td>
            </tr>`
        }
      })
      document.querySelector("#character-table tbody").innerHTML = html;
      document.querySelectorAll("#character-table tbody tr").forEach((ele, i) => {
        ele.style.animation = "textFadeIn .4s forwards"
        ele.style.animationDelay = i * 0.1 + "s"
      })
    },
    eventselectCharacters(e) {
      if (e.target.classList.contains("checkbox")) {
        if (!window.charsArr) window.charsArr = []
        console.log(window.charsArr, "length:", window.charsArr.length)
        if (!e.target.classList.contains("checked")) {
          if (window.charsArr.length < 2) {
            e.target.classList.add("checked")
            e.target.children[0].style.width = "100%"

            let id = parseInt(e.target.parentNode.parentNode.dataset.id)
            window.charsArr.push(id)
            this.renderPFP(window.charsArr)
            if (window.charsArr.length === 2) {
              this.compare(window.charsArr)
              this.previousComparison(window.charsArr)
            }
          }
        } else {
          e.target.classList.remove("checked")
          e.target.children[0].style.width = "0"

          let id = parseInt(e.target.parentNode.parentNode.dataset.id)
          window.charsArr.forEach((value, index) => {
            if (value == id) {
              window.charsArr.splice(index, 1)
            }
          })
          this.renderPFP(window.charsArr)

          this.board_1.style.backgroundColor = "transparent"
          this.board_2.style.backgroundColor = "transparent"

          this.clear(this.board_1.children)
          this.clear(this.board_2.children)
        }
        console.log(window.charsArr, "length:", window.charsArr.length)

      }
    },
    selectCharacters() {
      window.removeEventListener("click", this.eventselectCharacters)
      window.hasListener = true
      window.addEventListener("click", this.eventselectCharacters)
    },
    clear(eleList) {
      for (let ele of eleList) {
        ele.innerHTML = ""
      }
    },
    renderPFP(arr) {
      for (let i = 0; i < 2; i++) {
        let characterList = this.characterList
        let id = arr[i]
        let char = document.querySelector(".character-" + i)
        let charName = char.querySelector(".name")
        let charPFP = char.querySelector(".pfp")
        if (id !== undefined) {
          charName.innerHTML = characterList[id].name
          charPFP.style.background = `url(../src/assets/${characterList[id].image_url}) center / cover`
          charPFP.innerHTML = ""
        } else {
          charName.innerHTML = "Unknown"
          charPFP.style.background = "#fff"
          charPFP.innerHTML = "?"
        }
      }
    },
    eventbindPCEvent(e) {
      if (e.target.classList.contains("pc-record")) {
        let c1 = e.target.dataset.c1
        let c2 = e.target.dataset.c2

        this.renderPFP([c1, c2])
        this.compare([c1, c2])
        window.charsArr = [c1, c2]
        document.querySelectorAll("#character-table tbody tr").forEach((ele) => {
          let checkbox = ele.querySelector(".checkbox")
          if (checkbox.classList.contains("checked")) {
            checkbox.classList.remove("checked")
            checkbox.children[0].style.width = "0"
          }
          if (ele.dataset.id == c1 || ele.dataset.id == c2) {
            checkbox.classList.add("checked")
            checkbox.children[0].style.width = "100%"
          }
        })
      }
    },
    bindPCEvent() {
      window.removeEventListener("click", this.eventbindPCEvent)
      window.addEventListener("click", this.eventbindPCEvent)
    },
    loadPreCom() {
      /**
       * when fresh the page, load previous comparison records from local storage
       */
      if (window.localStorage.previousCompArr) {
        this.previousCompArr = JSON.parse(window.localStorage.previousCompArr)
        let pc_box = document.querySelector(".pc-box")
        for (const arr of this.previousCompArr) {
          let character_1 = this.characterList[arr[0]]
          let character_2 = this.characterList[arr[1]]
          let pc_record = `<div class="pc-record" data-c1="${arr[0]}" data-c2="${arr[1]}">
                <div>${character_1.name}</div>
                <div>${character_2.name}</div>
            </div>`
          pc_box.innerHTML += pc_record
        }
      }
    },
    compare(arr) {
      let comparingItems = ["strength", "speed", "skill", "fear_factor", "power", "intelligence", "wealth"]
      let character_1 = this.characterList[arr[0]]
      let character_2 = this.characterList[arr[1]]
      let score_1 = 0, score_2 = 0

      this.clear(this.board_1.children)
      this.clear(this.board_2.children)
      comparingItems.forEach((item, index) => {
        if (character_1[item] > character_2[item]) {
          this.board_1.children[index].innerHTML = `<svg t="1710272515909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7530"><path d="M476.4 714.2c-8.1 0-16.1-3.1-22.2-9.4L250.3 498.2c-12.3-12.4-12.3-32.6 0-45.1s32.2-12.5 44.4 0l181.8 184.2L906.9 201a31.09 31.09 0 0 1 44.5 0c12.3 12.4 12.3 32.6 0 45.1L498.6 704.9c-6.1 6.2-14.2 9.3-22.2 9.3zM507 959.6c-59.6 0-117.5-11.8-171.9-35.1-52.6-22.6-99.8-54.8-140.3-95.9-40.5-41.1-72.4-89-94.6-142.3-23.2-55.4-34.9-114-34.9-174.4 0-60.4 11.7-119.1 34.7-174.3 22.3-53.3 54.2-101.2 94.7-142.3 40.5-41.1 87.7-73.4 140.3-95.9 54.5-23.3 112.4-35.2 172-35.2 87.9 0 172.8 26.2 245.6 75.6 12.6 8.5 16.1 26 7.6 38.8-8.4 12.8-25.7 16.3-38.3 7.6-63.6-43.1-138-66-214.9-66-213.2 0-386.4 175.8-386.4 391.7 0 215.9 173.3 391.7 386.4 391.7 213 0 386.4-175.7 386.4-391.7 0-13.9-0.7-27.8-2.2-41.7-1.7-15.4 9.4-29.1 24.6-30.8 15.2-1.7 28.7 9.5 30.3 24.9 1.7 15.7 2.5 31.8 2.5 47.6 0 60.4-11.7 119.1-34.7 174.3-22.3 53.4-54 101.1-94.6 142.3-40.5 41.1-87.8 73.4-140.4 95.9-54.5 23.2-112.3 35.2-171.9 35.2z m0 0" fill="#ffffff" p-id="7531"></path></svg>`
          score_1++
        } else if (character_1[item] < character_2[item]) {
          this.board_2.children[index].innerHTML = `<svg t="1710272515909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7530"><path d="M476.4 714.2c-8.1 0-16.1-3.1-22.2-9.4L250.3 498.2c-12.3-12.4-12.3-32.6 0-45.1s32.2-12.5 44.4 0l181.8 184.2L906.9 201a31.09 31.09 0 0 1 44.5 0c12.3 12.4 12.3 32.6 0 45.1L498.6 704.9c-6.1 6.2-14.2 9.3-22.2 9.3zM507 959.6c-59.6 0-117.5-11.8-171.9-35.1-52.6-22.6-99.8-54.8-140.3-95.9-40.5-41.1-72.4-89-94.6-142.3-23.2-55.4-34.9-114-34.9-174.4 0-60.4 11.7-119.1 34.7-174.3 22.3-53.3 54.2-101.2 94.7-142.3 40.5-41.1 87.7-73.4 140.3-95.9 54.5-23.3 112.4-35.2 172-35.2 87.9 0 172.8 26.2 245.6 75.6 12.6 8.5 16.1 26 7.6 38.8-8.4 12.8-25.7 16.3-38.3 7.6-63.6-43.1-138-66-214.9-66-213.2 0-386.4 175.8-386.4 391.7 0 215.9 173.3 391.7 386.4 391.7 213 0 386.4-175.7 386.4-391.7 0-13.9-0.7-27.8-2.2-41.7-1.7-15.4 9.4-29.1 24.6-30.8 15.2-1.7 28.7 9.5 30.3 24.9 1.7 15.7 2.5 31.8 2.5 47.6 0 60.4-11.7 119.1-34.7 174.3-22.3 53.4-54 101.1-94.6 142.3-40.5 41.1-87.8 73.4-140.4 95.9-54.5 23.2-112.3 35.2-171.9 35.2z m0 0" fill="#ffffff" p-id="7531"></path></svg>`
          score_2++
        } else {
          if (Math.random() < 0.5) {
            this.board_1.children[index].innerHTML = `<svg t="1710272515909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7530"><path d="M476.4 714.2c-8.1 0-16.1-3.1-22.2-9.4L250.3 498.2c-12.3-12.4-12.3-32.6 0-45.1s32.2-12.5 44.4 0l181.8 184.2L906.9 201a31.09 31.09 0 0 1 44.5 0c12.3 12.4 12.3 32.6 0 45.1L498.6 704.9c-6.1 6.2-14.2 9.3-22.2 9.3zM507 959.6c-59.6 0-117.5-11.8-171.9-35.1-52.6-22.6-99.8-54.8-140.3-95.9-40.5-41.1-72.4-89-94.6-142.3-23.2-55.4-34.9-114-34.9-174.4 0-60.4 11.7-119.1 34.7-174.3 22.3-53.3 54.2-101.2 94.7-142.3 40.5-41.1 87.7-73.4 140.3-95.9 54.5-23.3 112.4-35.2 172-35.2 87.9 0 172.8 26.2 245.6 75.6 12.6 8.5 16.1 26 7.6 38.8-8.4 12.8-25.7 16.3-38.3 7.6-63.6-43.1-138-66-214.9-66-213.2 0-386.4 175.8-386.4 391.7 0 215.9 173.3 391.7 386.4 391.7 213 0 386.4-175.7 386.4-391.7 0-13.9-0.7-27.8-2.2-41.7-1.7-15.4 9.4-29.1 24.6-30.8 15.2-1.7 28.7 9.5 30.3 24.9 1.7 15.7 2.5 31.8 2.5 47.6 0 60.4-11.7 119.1-34.7 174.3-22.3 53.4-54 101.1-94.6 142.3-40.5 41.1-87.8 73.4-140.4 95.9-54.5 23.2-112.3 35.2-171.9 35.2z m0 0" fill="#ffffff" p-id="7531"></path></svg>`
            score_1++
          } else {
            this.board_2.children[index].innerHTML = `<svg t="1710272515909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7530"><path d="M476.4 714.2c-8.1 0-16.1-3.1-22.2-9.4L250.3 498.2c-12.3-12.4-12.3-32.6 0-45.1s32.2-12.5 44.4 0l181.8 184.2L906.9 201a31.09 31.09 0 0 1 44.5 0c12.3 12.4 12.3 32.6 0 45.1L498.6 704.9c-6.1 6.2-14.2 9.3-22.2 9.3zM507 959.6c-59.6 0-117.5-11.8-171.9-35.1-52.6-22.6-99.8-54.8-140.3-95.9-40.5-41.1-72.4-89-94.6-142.3-23.2-55.4-34.9-114-34.9-174.4 0-60.4 11.7-119.1 34.7-174.3 22.3-53.3 54.2-101.2 94.7-142.3 40.5-41.1 87.7-73.4 140.3-95.9 54.5-23.3 112.4-35.2 172-35.2 87.9 0 172.8 26.2 245.6 75.6 12.6 8.5 16.1 26 7.6 38.8-8.4 12.8-25.7 16.3-38.3 7.6-63.6-43.1-138-66-214.9-66-213.2 0-386.4 175.8-386.4 391.7 0 215.9 173.3 391.7 386.4 391.7 213 0 386.4-175.7 386.4-391.7 0-13.9-0.7-27.8-2.2-41.7-1.7-15.4 9.4-29.1 24.6-30.8 15.2-1.7 28.7 9.5 30.3 24.9 1.7 15.7 2.5 31.8 2.5 47.6 0 60.4-11.7 119.1-34.7 174.3-22.3 53.4-54 101.1-94.6 142.3-40.5 41.1-87.8 73.4-140.4 95.9-54.5 23.2-112.3 35.2-171.9 35.2z m0 0" fill="#ffffff" p-id="7531"></path></svg>`
            score_2++
          }
        }
      })
      /**
       * compare final scores of two characters
       */
      if (score_1 > score_2) {
        this.board_1.style.backgroundColor = "#00550C"
        this.board_2.style.backgroundColor = "#540000"
      } else {
        this.board_1.style.backgroundColor = "#540000"
        this.board_2.style.backgroundColor = "#00550C"
      }
    },
    previousComparison(arr) {
      /**
       * after comparing 2 characters, add a record into Previous Comparison box
       */

      let pc_box = document.querySelector(".pc-box")
      let character_1 = this.characterList[arr[0]]
      let character_2 = this.characterList[arr[1]]
      let pc_record = `<div class="pc-record" data-c1="${arr[0]}" data-c2="${arr[1]}">
                <div>${character_1.name}</div>
                <div>${character_2.name}</div>
            </div>`
      pc_box.innerHTML += pc_record

      /**
       * save previous comparison records into local storage
       */
      this.previousCompArr.push(JSON.parse(JSON.stringify(arr)))
      window.localStorage.previousCompArr = JSON.stringify(this.previousCompArr)
      console.log(window.localStorage.previousCompArr)
    },
    dragFilterButton() {
      let isDown = false
      let mouseX = 0
      let elementX = 0
      let draggedBtn
      let btnStyle = window.getComputedStyle(document.querySelector(".filter-button"))
      let lineLength = parseInt(window.getComputedStyle(document.querySelector(".filter-box")).width)
      let minX = 0 - parseInt(btnStyle.width) / 2
      let maxX = lineLength - parseInt(btnStyle.width) / 2

      for (const btn of document.querySelectorAll(".filter-button")) {
        btn.style.left = window.getComputedStyle(btn).left
        btn.addEventListener("mousedown", e => {
          isDown = true
          mouseX = e.pageX
          draggedBtn = btn
          elementX = parseInt(btn.style.left)
        })
      }
      document.addEventListener("mousemove", e => {
        if (isDown) {
          document.querySelector("#search-input").value = ""
          let currentX = elementX - mouseX + e.pageX
          currentX = this.max(currentX, minX)
          currentX = this.min(currentX, maxX)

          draggedBtn.style.left = currentX + "px"
          draggedBtn.innerHTML = Math.round((currentX + parseInt(btnStyle.width) / 2) / lineLength * 100)

          //redraw the black line between 2 buttons
          let parentEle = draggedBtn.parentNode
          let btns = parentEle.querySelectorAll(".filter-button")
          let x1 = parseInt(btns[0].style.left)
          let x2 = parseInt(btns[1].style.left)
          let line = parentEle.querySelector(".filter-inner-line")
          line.style.left = this.min(x1, x2) + 'px'
          line.style.width = this.max(x1, x2) - this.min(x1, x2) + 'px'

          this.filterChars()
        }
      })
      document.addEventListener("mouseup", () => {
        isDown = false
      })
    },
    filterChars() {
      let filters = document.querySelectorAll(".filter-box")
      let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      filters.forEach((filter) => {
        let num1 = parseInt(filter.querySelector(".filter-button-1").innerHTML)
        let num2 = parseInt(filter.querySelector(".filter-button-2").innerHTML)
        let min_value = this.min(num1, num2)
        let max_value = this.max(num1, num2)
        let attr = filter.dataset.attr
        for (let i = 0; i < this.characterList.length; i++) {
          let char = this.characterList[i]
          if (char[attr] < min_value || char[attr] > max_value) {
            if (arr.indexOf(i) >= 0) arr.splice(arr.indexOf(i), 1)
          }
        }
      })
      this.displayChars(arr)
    },
    max(a, b) {
      return a > b ? a : b
    },
    min(a, b) {
      return a > b ? b : a
    },
    processSearch(event) {
      let searchValue = event.target.value;
      console.log(searchValue);
      this.search(searchValue);
    },
    search(searchValue) {
      let results = []

      for (let i = 0; i < this.characterList.length; i++) {
        let char = this.characterList[i]

        /**
         * not case-sensitive
         */
        if (char.name.match(searchValue) || char.name.toLowerCase().match(searchValue.toLowerCase())) {
          results.push(i)
        }
      }
      this.displayChars(results)
    },
    displayChars(arr) {
      let html = ``
      for (let i = 0; i < arr.length; i++) {
        let character = this.characterList[arr[i]]
        html += `
            <tr data-id="${i}" v-if="${character.active}">
                <td class="home-character-name" data-id="${character._id}">${character.name}</td>
                <td>${character.strength}</td>
                <td>${character.speed}</td>
                <td>${character.skill}</td>
                <td>${character.fear_factor}</td>
                <td>${character.power}</td>
                <td>${character.intelligence}</td>
                <td>${character.wealth}</td>
                <td><div class="checkbox"><span><svg t="1709959345452" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1599"><path d="M155.644361 439.225533 376.468722 660.086733l486.86146-490.229161 95.379301 95.352695-585.574692 588.933183L65.289494 546.298154 155.644361 439.225533 155.644361 439.225533zM155.644361 439.225533" fill="#272636" p-id="1600"></path></svg></span></div></td>
            </tr>`
      }
      if (html === "") html = `<tr><td colspan="9" style="padding: 20px; font-size: 24px; text-align: center">No characters found.</td></tr>`
      document.querySelector("#character-table tbody").innerHTML = html;
      document.querySelectorAll("#character-table tbody tr").forEach((ele, i) => {
        ele.style.animation = "textFadeIn .4s forwards"
        ele.style.animationDelay = i * 0.1 + "s"
      })
    }
  },
  beforeUnmount() {
    sessionStorage.removeItem('isHomeLoaded');
    window.charsArr = []
  },
  beforeRouteLeave() {
    window.charsArr = []
  },
}
</script>
<style src="../assets/home.css"></style>
<style>
.home-character-name {
  cursor: pointer;
  transition: .3s all;
}
.home-character-name:hover {
  color: dodgerblue;
  transform: scale(1.2);
}
</style>
