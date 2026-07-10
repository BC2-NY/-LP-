# CloudFront から S3 へ署名付きでアクセスするための OAC
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "ku-fes-lp-oac"
  description                       = "OAC for ku-fes-lp static site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# AWS管理のキャッシュポリシー（静的サイト向けの推奨設定）
data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

# ブラウザに返すセキュリティヘッダーをまとめて付与するポリシー
resource "aws_cloudfront_response_headers_policy" "security" {
  name = "ku-fes-lp-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  default_root_object = "index.html"
  comment             = "ku-fes-lp"
  # PriceClass_200 = 日本を含むアジアのエッジを使う（国内アクセスが速い）
  price_class = "PriceClass_200"

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-ku-fes-lp"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-ku-fes-lp"
    viewer_protocol_policy     = "redirect-to-https" # HTTPは全てHTTPSへ強制
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # 今は CloudFront 標準ドメイン(xxxx.cloudfront.net)のHTTPS証明書を使用。
  # 独自ドメインが決まったら、ここを ACM 証明書に差し替える。
  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}
