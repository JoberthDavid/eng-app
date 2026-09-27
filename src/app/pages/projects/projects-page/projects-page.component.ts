import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';

interface ProjectSummary {
  code: string;
  description: string;
  uf: string;
  highway: string;
  budgets: number;
}

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
  readonly projects: ProjectSummary[] = this.projectService.getProjects();


}