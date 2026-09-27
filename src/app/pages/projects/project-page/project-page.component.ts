import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectDetail } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';


@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);

  readonly projectId = this.route.snapshot.paramMap.get('id');
  
  readonly project = this.projectId ? this.projectService.getProject(this.projectId): null;

}