import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboards', pathMatch: 'full' },
  { path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboards',
    loadChildren: () => import('./features/dashboards-list/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'tasks',
    loadChildren: () => import('./features/tasks-page/tasks.module').then(m => m.TasksModule) },
  { path: 'user',
    loadChildren: () => import('./features/user-page/user.module').then(m => m.UserModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
