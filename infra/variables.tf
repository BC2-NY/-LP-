variable "region" {
  description = "メインのAWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "profile" {
  description = "AWS CLIのプロファイル名（aws configure --profile で作ったもの）"
  type        = string
  default     = "ku-fes"
}

variable "github_repo" {
  description = "GitHub Actionsからのデプロイを許可するリポジトリ（owner/repo）"
  type        = string
  default     = "BC2-NY/-LP-"
}

variable "alert_email" {
  description = "予算超過アラートの通知先メール。空にすると予算アラートを作らない"
  type        = string
  default     = ""
}
