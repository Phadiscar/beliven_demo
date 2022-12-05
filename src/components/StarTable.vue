<template>

  <div>
    <!-- Add project -->
    <div class="p-3 d-flex justify-content-end">
      <button class="btn btn-primary" data-bs-target="#addProjectModal" data-bs-toggle="modal">New Project</button>
    </div>
    <!-- Filter -->
    <div class="d-flex justify-content-between px-3">
      <!-- Most Star -->
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
            role="tab" aria-controls="all" aria-selected="true" @click="(mostStar = false)">All</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="moststar-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button"
            role="tab" aria-controls="mostStar" aria-selected="false" @click="(mostStar = true)">Most Star</button>
        </li>
      </ul>
      <!-- Search -->
      <input class="form-control w-auto mb-2" v-model="searchString" placeholder="Search">
    </div>
    <!-- Table -->
    <div class="px-3">
      <table class="table table-striped table-bordered">
        <thead>
          <tr class="text-center">
            <th width="20%" @click="sortTable('name')">Name
              <img class="arrow" v-if="('name' != sortColumn)" src="@/assets/arrows-couple.png">
              <img class="arrow" v-if="('name' === sortColumn && !ascending)" src="@/assets/arrow-up.png">
              <img class="arrow" v-if="('name' === sortColumn && ascending)" src="@/assets/arrow-down.png">
            </th>
            <th width="40%">Description</th>
            <th width="15%" @click="sortTable('createdAt')">Creation Date
              <img class="arrow" v-if="('createdAt' != sortColumn)" src="@/assets/arrows-couple.png">
              <img class="arrow" v-if="('createdAt' === sortColumn && !ascending)" src="@/assets/arrow-up.png">
              <img class="arrow" v-if="('createdAt' === sortColumn && ascending)" src="@/assets/arrow-down.png">
            </th>
            <th width="10%" @click="sortTable('stars')">Stars
              <img class="arrow" v-if="('stars' != sortColumn)" src="@/assets/arrows-couple.png">
              <img class="arrow" v-if="('stars' === sortColumn && !ascending)" src="@/assets/arrow-up.png">
              <img class="arrow" v-if="('stars' === sortColumn && ascending)" src="@/assets/arrow-down.png">
            </th>
            <th width="15%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, index) in filteredProjects" :key="project.name">
            <td>{{ project.name }}</td>
            <td>{{ project.description }}</td>
            <td class="text-center">{{ formatDate(project.createdAt) }}</td>
            <td class="text-center">{{ project.stars }}</td>
            <td class="text-center">
              <button v-if="!project.voted" class="btn btn-warning" @click="toogleRateStar(index)">Rate</button>
              <button v-if="project.voted" class="btn btn-danger" @click="toogleRateStar(index)">Unrate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add Project -->
    <div class="modal" id="addProjectModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Project</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-column">
              <label class="font-weight-bold">Name</label>
              <input class="form-control" v-model="name">
            </div>
            <div class="d-flex flex-column">
              <label class="font-weight-bold">Description</label>
              <input class="form-control" v-model="description">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="addNewProject()" data-bs-dismiss="modal">Save</button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup>

import { computed, ref } from 'vue';
// Store state
import { useProjectStore } from '@/stores/useProjectStore'
const projectStore = useProjectStore();

const name = ref("");
const description = ref("");
const searchString = ref("");
const sortColumn = ref("");
const ascending = ref(false);
const mostStar = ref(false);

const projects = projectStore.$state.projects;

// Filter Project
const filteredProjects = computed(() => {

  return filterSearchString(showHideMostStar(projects));

});

// Sort
computed(() => {

  if (projects.length == 0) {
    return [];
  }
  return Object.keys(projects[0])
});

//Search String Filter
function filterSearchString(projects) {

  if (searchString.value != "") {
    return projects.filter(project => Object.values(project).join("").toLowerCase().toString().indexOf(searchString.value.toLowerCase()) !== -1);
  } else {
    return projects;
  }
}

//Most Stars (show 3 most stars project)
function showHideMostStar(projects) {
  if (mostStar.value === true) {
    return projects
      .sort((a, b) => {
        return b.stars - a.stars
      })
      // 3 most stars
      .slice(0, 3);
  } else {
    return projects;
  }

}

//Vote Unvote Project
function toogleRateStar(row_id) {
  if (!projects[row_id].voted) {
    projects[row_id].voted = true;
    projects[row_id].stars += 1;
  } else {
    projects[row_id].voted = false;
    projects[row_id].stars = projects[row_id].stars - 1;
  }
}

// Sort function
function sortTable(col) {
  if (sortColumn.value === col) {
    ascending.value = !ascending.value;
  } else {
    ascending.value = true;
    sortColumn.value = col;
  }

  projects.sort(function (a, b) {
    if (a[col] > b[col]) {
      return ascending.value ? 1 : -1
    } else if (a[col] < b[col]) {
      return ascending.value ? -1 : 1
    }
    return 0;
  })
}

//Add new project
function addNewProject() {
  const current = new Date();
  projects.push({
    "name": name.value,
    "description": description.value,
    "createdAt": `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`,
    "stars": 0
  })
  name.value = "";
  description.value = "";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  // Then specify how you want your dates to be formatted
  return new Intl.DateTimeFormat(['ban', 'id']).format(date);
}

</script>

<style>
.arrow {
  height: 10px;
  width: 10px;
}
</style>