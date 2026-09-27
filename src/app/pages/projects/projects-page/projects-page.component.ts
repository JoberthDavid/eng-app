import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  pageTitle = 'Projetos';
  private readonly projectService = inject(ProjectService);
  readonly projects = this.projectService.getProjects();


}