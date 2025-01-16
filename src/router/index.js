import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Schedule from "@/views/Schedule.vue";
import ScheduleView from "@/views/ScheduleView.vue";
import Notices from "@/views/Notices.vue";
import Issue from "@/views/Issue.vue";
import Admin from "@/views/admin/Admin.vue";
import Login from "@/views/Login.vue";
import Notice from "@/views/notice.vue";
import IssueView from "@/views/IssueView.vue";
import IssueReport from "@/views/IssueReport.vue";
import NoticeManage from "@/views/admin/NoticeManage.vue";
import IssueManage from "@/views/admin/IssueManage.vue";
import ScheduleManage from "@/views/admin/ScheduleManage.vue";
import Introduce from "@/views/Introduce.vue";
import songRequest from "@/views/songRequest.vue";
import songManage from "@/views/admin/songManage.vue";
import Apply from "@/views/apply.vue";
import ApplyMy from "@/views/apply-my.vue";
import forms from "@/views/admin/forms.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/schedule", name: "Schedule", component: Schedule },
  { path: "/schedule/view/:id", name: "ScheduleView", component: ScheduleView },
  { path: "/notices", name: "Notices", component: Notices },
  { path: "/issue", name: "Issue", component: Issue },
  { path: "/admin", name: "Admin", component: Admin },
  { path: "/login", name: "Login", component: Login },
  { path: "/notice/:id", name: "Notice", component: Notice },
  { path: "/issue/:id", name: "IssueView", component: IssueView },
  { path: "/issue/report", name: "IssueReport", component: IssueReport },
  { path: "/admin/notice", name: "NoticeManage", component: NoticeManage },
  { path: "/admin/issue", name: "IssueManage", component: IssueManage },
  { path: "/admin/schedule", name: "ScheduleManage", component: ScheduleManage },
  { path: "/introduce", name: "Introduce", component: Introduce },
  { path: "/songrequest", name: "songRequest", component: songRequest },
  { path: "/admin/song", name: "songManage", component: songManage },
  { path: "/apply", name: "Apply", component: Apply },
  { path: "/apply-my", name: "ApplyMy", component: ApplyMy },
  { path: "/admin/forms", name: "ApplyForms", component: forms }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // 관리자 페이지 접근 제한
  if (to.name === "Admin" && !isAuthenticated) {
    next({ name: "Login" });
  } else if (to.name === "Login" && isAuthenticated) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
