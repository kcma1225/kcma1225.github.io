---
title: 'What is K8s'
description: 'Let you know what is K8s'
pubDate: 'Mar 02 2026'
---



# 什麼是 Kubernetes？

> Kubernetes（簡稱 K8s）是一個用於**自動化部署、擴展與管理容器化應用程式**的開源平台。


---

## 為什麼會出現 Kubernetes

在雲端原生（Cloud Native）時代，應用程式逐漸轉向：

* 容器化（Containerization）
* 微服務架構（Microservices Architecture）
* 彈性擴展（Auto Scaling）
* 高可用性（High Availability）

當系統變成由數十甚至數百個容器組成時，單純使用 Docker 已經無法有效管理整體運行狀態。這時候就需要一個「容器管理系統」，而 Kubernetes 正是為此而生。

---

## 核心概念

### 1. 容器（Container）

容器是一種輕量化的虛擬化技術，將應用程式與其依賴環境打包在一起。

### 2. Pod

在 Kubernetes 中，**最小部署單位不是容器，而是 Pod**。

* 一個 Pod 可以包含一個或多個容器
* Pod 內的容器共享網路與儲存空間

### 3. Node

Node 是實際執行容器的機器，可以是：

* 實體伺服器
* 虛擬機
* 雲端主機

### 4. Cluster

Cluster 是由多個 Node 組成的運算資源集合。

---

## 架構說明

Kubernetes 架構分為兩大部分：

### Control Plane（控制平面）

負責整個叢集的管理與決策：

* API Server
* Scheduler
* Controller Manager
* etcd（儲存叢集狀態）

### Worker Node（工作節點）

負責實際執行容器：

* kubelet
* kube-proxy
* Container Runtime

---

## 重要資源物件

### Deployment

用來管理 Pod 的副本數量與版本更新。

### Service

提供固定的網路入口，使 Pod 可被外部或內部存取。

### ConfigMap

儲存非機密設定資料。

### Secret

儲存敏感資料，例如密碼或 API Key。

---

## 實際運作流程

1. 開發者撰寫 YAML 設定檔
2. 使用 `kubectl apply -f` 部署
3. API Server 接收請求
4. Scheduler 決定 Pod 放置在哪個 Node
5. kubelet 啟動容器

---

## 優點與價值

* 自動修復（Self-healing）
* 滾動更新（Rolling Update）
* 水平擴展（Horizontal Scaling）
* 宣告式管理（Declarative Configuration）

---

## 簡單範例 YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

---

## 總結

Kubernetes 是現代雲端基礎架構的核心技術之一。

它解決了：

* 容器大規模管理問題
* 微服務部署複雜度
* 高可用與自動擴展需求

隨著雲端原生技術的發展，Kubernetes 幾乎已成為標準解決方案。
