output "site_url" {
  description = "公開URL（CloudFront標準ドメイン）"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "s3_bucket_name" {
  description = "サイトファイルをアップロードするS3バケット名"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "キャッシュ削除（invalidation）に使うディストリビューションID"
  value       = aws_cloudfront_distribution.site.id
}

output "github_deploy_role_arn" {
  description = "GitHub Actionsのワークフローに設定するIAMロールのARN"
  value       = aws_iam_role.github_deploy.arn
}
