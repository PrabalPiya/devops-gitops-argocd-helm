# GitOps with Argo CD and Helm

This is a simple DevOps GitOps project where a simple Node.js application is deployed to Kubernetes using Argo CD and Helm.

The goal of this project is to understand how GitOps works in a Kubernetes environment. Instead of manually applying Kubernetes YAML files using `kubectl apply`, Argo CD watches a GitHub repository and keeps the Kubernetes cluster synced with the configuration stored in Git.

This project uses Minikube for a local Kubernetes cluster, Helm for packaging Kubernetes manifests, GitHub Actions for building the Docker image, and Argo CD for GitOps-based deployment.

---

## What This Project Demonstrates

* Building a simple Node.js web application
* Dockerizing the application
* Building and pushing Docker images using GitHub Actions
* Creating a Helm chart for Kubernetes deployment
* Installing and using Argo CD
* Deploying an application to Kubernetes using GitOps
* Understanding Argo CD sync, health, and self-healing
* Managing Kubernetes changes through Git

---

## Tools Used

* Node.js
* Express.js
* Docker
* Docker Hub
* GitHub Actions
* Kubernetes
* Minikube
* Helm
* Argo CD
* Git/GitHub

---

## Architecture

```text
Developer pushes code to GitHub
→ GitHub Actions builds Docker image
→ Docker image is pushed to Docker Hub
→ Helm chart stores Kubernetes deployment configuration
→ Argo CD watches the GitHub repository
→ Argo CD syncs the Helm chart to Kubernetes
→ Application runs inside Minikube
```

---

## Folder Structure

```text
devops-gitops-argocd-helm/
│
├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── helm/
│   └── devops-app/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           └── service.yaml
│
├── .github/
│   └── workflows/
│       └── docker-ci.yml
│
├── .gitignore
└── README.md
```

---

## How to Run This Project

### 1. Start Minikube

```bash
minikube start --driver=docker
```

Check cluster:

```bash
kubectl get nodes
```

---

### 2. Install Argo CD

Create namespace:

```bash
kubectl create namespace argocd
```

Install Argo CD:

```bash
kubectl apply -n argocd --server-side --force-conflicts -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Check Argo CD pods:

```bash
kubectl get pods -n argocd
```

---

### 3. Access Argo CD UI

Port forward Argo CD server:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open:

```text
https://localhost:8080
```

Get initial admin password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
```

Login:

```text
Username: admin
Password: decoded password
```

---

### 4. Create Application Namespace

```bash
kubectl create namespace devops-gitops
```

---

### 5. Create Argo CD Application

Create a file named:

```text
argocd-app.yaml
```

Apply it:

```bash
kubectl apply -f argocd-app.yaml
```

---

### 6. Verify Deployment

Check Argo CD application in the UI.

Expected status:

```text
Synced
Healthy
```

Check Kubernetes resources:

```bash
kubectl get all -n devops-gitops
```

Expected resources:

```text
deployment/devops-app
service/devops-app-service
pods running
```

---

### 7. Access the Application

Use Minikube service command:

```bash
minikube service devops-app-service -n devops-gitops --url
```

Test the app:

```bash
curl <url>
curl <url>/health
```

---

## Testing GitOps

To test GitOps, update a value in Git.

Example: change `replicaCount` in:

```text
helm/devops-app/values.yaml
```

From:

```yaml
replicaCount: 2
```

To:

```yaml
replicaCount: 3
```

Commit and push:

```bash
git add .
git commit -m "Scale app using GitOps"
git push
```

Argo CD will detect the change and sync the cluster.

Verify:

```bash
kubectl get pods -n devops-gitops
```

You should see 3 app pods.

---

## Important Concepts Learned

### GitOps

GitOps means Git is the source of truth for infrastructure and application deployment.

Instead of manually changing the cluster, changes are made in Git, and Argo CD applies them to Kubernetes.

---

### Argo CD

Argo CD watches the Git repository and compares it with the Kubernetes cluster.

Common Argo CD statuses:

| Status      | Meaning                         |
| ----------- | ------------------------------- |
| `Synced`    | Cluster matches Git             |
| `OutOfSync` | Cluster does not match Git      |
| `Healthy`   | Application is running properly |
| `Degraded`  | Something is wrong              |

---

### Helm

Helm is used to package Kubernetes manifests.

Instead of writing repeated YAML values in many files, Helm uses templates and values.

Example:

```yaml
replicaCount: 2
```

This value is used inside the Deployment template.

---

### Self-Healing

Self-healing means Argo CD can fix manual changes made directly in the cluster.

Example:

```bash
kubectl scale deployment devops-app --replicas=1 -n devops-gitops
```

If Git says replicas should be `2`, Argo CD can change it back.

---

### Prune

Prune means Argo CD can remove Kubernetes resources that were deleted from Git.

This keeps the cluster clean and aligned with the repository.

---

## Useful Commands

Check Argo CD pods:

```bash
kubectl get pods -n argocd
```

Check application resources:

```bash
kubectl get all -n devops-gitops
```

Check app pods:

```bash
kubectl get pods -n devops-gitops
```

Check service:

```bash
kubectl get svc -n devops-gitops
```

Check logs:

```bash
kubectl logs -n devops-gitops deployment/devops-app
```

Check Helm chart:

```bash
helm lint helm/devops-app
helm template devops-app helm/devops-app
```

Access app:

```bash
minikube service devops-app-service -n devops-gitops --url
```

