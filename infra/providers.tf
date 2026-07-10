terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

# メインのリージョン（東京）。S3バケットなどはここに作られる
provider "aws" {
  region  = var.region
  profile = var.profile
  default_tags {
    tags = {
      Project   = "ku-fes-lp"
      ManagedBy = "terraform"
    }
  }
}

# ACM証明書（独自ドメイン用）は CloudFront の仕様上 us-east-1 でしか作れない。
# 今はドメイン未定なので使わないが、後から足すときのために用意しておく。
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = var.profile
  default_tags {
    tags = {
      Project   = "ku-fes-lp"
      ManagedBy = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}
