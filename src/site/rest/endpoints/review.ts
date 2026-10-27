import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

export const reviewAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.review.answers.malformedUrl",
    json: {
      error: "REQUEST_REFUSED",
      message: "Malformed URL.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 100, 110)
  },
  {
    status: 401,
    when: "rest.review.answers.noToken",
    json: {
      error: "UNAUTHORIZED",
      message: "a bearer token is required",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "app/Http/Middleware/AuthenticateIdentityToken.php", 23, 28)
  },
  {
    status: 401,
    when: "rest.review.answers.invalidToken",
    json: {
      error: "UNAUTHORIZED",
      message: "invalid token",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "app/Http/Middleware/AuthenticateIdentityToken.php", 30, 34)
  },
  {
    status: 404,
    when: "rest.review.answers.unknownPath",
    json: {
      error: "REQUEST_REFUSED",
      message: "The route api/v1/reviews/orders could not be found.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 100, 110)
  },
  {
    status: 405,
    when: "rest.review.answers.methodNotAllowed",
    headers: ["Allow: POST"],
    json: {
      error: "REQUEST_REFUSED",
      message: "The GET method is not supported for route api/v1/reviews/products. Supported methods: POST.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 100, 110)
  },
  {
    status: 413,
    when: "rest.review.answers.bodyTooLarge",
    json: {
      error: "REQUEST_REFUSED",
      message: "The POST data is too large.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 100, 110)
  },
  {
    status: 422,
    when: "rest.review.answers.bodyNotJson",
    json: {
      error: "VALIDATION_FAILED",
      message: "The order id field is required. (and 2 more errors)",
      errors: {
        order_id: ["The order id field is required."],
        product_id: ["The product id field is required."],
        rating: ["The rating field is required."]
      },
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 76, 86)
  },
  {
    status: 500,
    when: "rest.review.answers.internal",
    json: {
      error: "INTERNAL_ERROR",
      message: "something went wrong handling this request. No review was saved unless a previous response said so.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 132, 140)
  },
  {
    status: 503,
    when: "rest.review.answers.databaseUnavailable",
    json: {
      error: "SERVICE_UNAVAILABLE",
      message: "the review database could not be reached, so this request could not be completed. Try again later.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "bootstrap/app.php", 112, 130)
  },
  {
    status: 503,
    when: "rest.review.answers.identityKeysUnavailable",
    json: {
      error: "SERVICE_UNAVAILABLE",
      message:
        "identity's signing keys could not be fetched, so the token on this request could not be checked. Nothing was saved.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "app/Security/TokenVerifier.php", 41, 50)
  },
  {
    status: 503,
    when: "rest.review.answers.orderUnreachable",
    json: {
      error: "SERVICE_UNAVAILABLE",
      message:
        "the order service could not be reached, so this review could not be checked against your order. Nothing was saved.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "app/Clients/GrpcOrderClient.php", 95, 133)
  },
  {
    status: 503,
    when: "rest.review.answers.orderPaused",
    headers: ["Retry-After: 17"],
    json: {
      error: "SERVICE_UNAVAILABLE",
      message:
        "the order service is failing and calls to it are paused, so this review could not be checked against your order. Nothing was saved.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("review", "app/Clients/GrpcOrderClient.php", 68, 72)
  }
];

export const reviewEndpoints: readonly RestEndpoint[] = [
  {
    id: "review.createProductReview",
    service: "review",
    method: "POST",
    path: "/api/v1/reviews/products",
    summary: "rest.review.createProductReview.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.review.createProductReview.who"
    },
    request: {
      fields: [
        {
          name: "order_id",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.review.createProductReview.field.orderId"
        },
        {
          name: "product_id",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.review.createProductReview.field.productId"
        },
        {
          name: "rating",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.review.createProductReview.field.rating"
        },
        {
          name: "comment",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.review.createProductReview.field.comment"
        }
      ],
      json: {
        order_id: "8d4f2a6c-1b3e-4c7d-9a5f-0e2b4c6d8f1a",
        product_id: "KOPI-GAYO-250G",
        rating: 5,
        comment: "Kopinya segar, kemasan rapi."
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.review.createProductReview.case.created",
        json: {
          product_id: "KOPI-GAYO-250G",
          merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d",
          rating: 5,
          comment: "Kopinya segar, kemasan rapi.",
          id: "019a0b4e-6f2d-7c3a-9b1e-4d5f6a7b8c9d",
          updated_at: "2026-10-22T03:15:00.000000Z",
          created_at: "2026-10-22T03:15:00.000000Z"
        },
        source: restSource("review", "app/Http/Controllers/ProductReviewController.php", 29, 32)
      },
      {
        status: 409,
        when: "rest.review.createProductReview.case.alreadyReviewed",
        json: {
          error: "REQUEST_REFUSED",
          message: "this product from this order has already been reviewed. Nothing was saved.",
          review_id: "019a0b4e-6f2d-7c3a-9b1e-4d5f6a7b8c9d",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Repositories/EloquentProductReviewRepository.php", 14, 20)
      },
      {
        status: 422,
        when: "rest.review.createProductReview.case.invalid",
        json: {
          error: "VALIDATION_FAILED",
          message: "The product id field is required. (and 1 more error)",
          errors: {
            product_id: ["The product id field is required."],
            rating: ["The rating field must be an integer."]
          },
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Http/Controllers/ProductReviewController.php", 22, 27)
      },
      {
        status: 422,
        when: "rest.review.createProductReview.case.orderNotFound",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Order not found.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 20, 23)
      },
      {
        status: 422,
        when: "rest.review.createProductReview.case.notYourOrder",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Order does not belong to this customer.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 25, 27)
      },
      {
        status: 422,
        when: "rest.review.createProductReview.case.ownProduct",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "A merchant cannot review its own product.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 29, 31)
      },
      {
        status: 422,
        when: "rest.review.createProductReview.case.notDelivered",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Reviews are only allowed for DELIVERED or COMPLETED orders.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 33, 35)
      },
      {
        status: 422,
        when: "rest.review.createProductReview.case.productNotInOrder",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Product was not purchased in this order.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 37, 39)
      }
    ],
    source: restSource("review", "app/Http/Controllers/ProductReviewController.php", 19, 43)
  },
  {
    id: "review.createDriverRating",
    service: "review",
    method: "POST",
    path: "/api/v1/reviews/drivers",
    summary: "rest.review.createDriverRating.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.review.createDriverRating.who"
    },
    request: {
      fields: [
        {
          name: "order_id",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.review.createDriverRating.field.orderId"
        },
        {
          name: "rating",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.review.createDriverRating.field.rating"
        },
        {
          name: "comment",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.review.createDriverRating.field.comment"
        }
      ],
      json: {
        order_id: "8d4f2a6c-1b3e-4c7d-9a5f-0e2b4c6d8f1a",
        rating: 4,
        comment: "Kurir ramah dan tepat waktu."
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.review.createDriverRating.case.created",
        json: {
          driver_principal_id: "a3c5e7f9-2b4d-4f6a-8c1e-3d5f7a9b1c2e",
          rating: 4,
          comment: "Kurir ramah dan tepat waktu.",
          id: "019a0b4f-0a1b-7c2d-8e3f-5a6b7c8d9e0f",
          updated_at: "2026-10-22T03:15:00.000000Z",
          created_at: "2026-10-22T03:15:00.000000Z"
        },
        source: restSource("review", "app/Http/Controllers/DriverRatingController.php", 28, 31)
      },
      {
        status: 409,
        when: "rest.review.createDriverRating.case.alreadyRated",
        json: {
          error: "REQUEST_REFUSED",
          message: "the courier of this order has already been rated. Nothing was saved.",
          review_id: "019a0b4f-0a1b-7c2d-8e3f-5a6b7c8d9e0f",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Repositories/EloquentDriverRatingRepository.php", 14, 20)
      },
      {
        status: 422,
        when: "rest.review.createDriverRating.case.invalid",
        json: {
          error: "VALIDATION_FAILED",
          message: "The rating field must be at least 1. (and 1 more error)",
          errors: {
            rating: ["The rating field must be at least 1."],
            comment: ["The comment field must be a string."]
          },
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Http/Controllers/DriverRatingController.php", 22, 26)
      },
      {
        status: 422,
        when: "rest.review.createDriverRating.case.orderNotFound",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Order not found.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/DriverRatingService.php", 20, 23)
      },
      {
        status: 422,
        when: "rest.review.createDriverRating.case.notYourOrder",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Order does not belong to this customer.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/DriverRatingService.php", 25, 27)
      },
      {
        status: 422,
        when: "rest.review.createDriverRating.case.ownDelivery",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "A courier cannot rate its own delivery.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/DriverRatingService.php", 29, 31)
      },
      {
        status: 422,
        when: "rest.review.createDriverRating.case.notDelivered",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Driver ratings are only allowed for DELIVERED or COMPLETED orders.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/DriverRatingService.php", 33, 35)
      },
      {
        status: 422,
        when: "rest.review.createDriverRating.case.noCourier",
        json: {
          error: "UNPROCESSABLE_ENTITY",
          message: "Order records no courier who delivered it.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("review", "app/Services/DriverRatingService.php", 37, 39)
      }
    ],
    source: restSource("review", "app/Http/Controllers/DriverRatingController.php", 19, 42)
  },
  {
    id: "review.listProductReviews",
    service: "review",
    method: "GET",
    path: "/api/v1/reviews/products/{productId}",
    summary: "rest.review.listProductReviews.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.review.listProductReviews.who"
    },
    request: {
      fields: [
        {
          name: "productId",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.review.listProductReviews.field.productId"
        },
        {
          name: "page",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.review.listProductReviews.field.page"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.review.listProductReviews.case.listed",
        json: {
          product_id: "KOPI-GAYO-250G",
          average_rating: 4.5,
          total_reviews: 2,
          data: [
            {
              id: "019a0b4e-6f2d-7c3a-9b1e-4d5f6a7b8c9d",
              product_id: "KOPI-GAYO-250G",
              rating: 5,
              comment: "Kopinya segar, kemasan rapi.",
              created_at: "2026-10-22T03:15:00.000000Z",
              updated_at: "2026-10-22T03:15:00.000000Z",
              merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d"
            },
            {
              id: "0199f2c1-8d3e-7a4b-b5c6-7d8e9f0a1b2c",
              product_id: "KOPI-GAYO-250G",
              rating: 4,
              comment: null,
              created_at: "2026-10-17T09:42:11.000000Z",
              updated_at: "2026-10-17T09:42:11.000000Z",
              merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d"
            }
          ],
          current_page: 1,
          last_page: 1
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 51, 64)
      },
      {
        status: 200,
        when: "rest.review.listProductReviews.case.none",
        json: {
          product_id: "KOPI-GAYO-500G",
          average_rating: 0,
          total_reviews: 0,
          data: [],
          current_page: 1,
          last_page: 1
        },
        source: restSource("review", "app/Repositories/EloquentProductReviewRepository.php", 22, 37)
      }
    ],
    source: restSource("review", "app/Http/Controllers/ProductReviewController.php", 45, 49)
  },
  {
    id: "review.listMerchantReviews",
    service: "review",
    method: "GET",
    path: "/api/v1/reviews/merchants/{merchantPrincipalId}",
    summary: "rest.review.listMerchantReviews.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.review.listMerchantReviews.who"
    },
    request: {
      fields: [
        {
          name: "merchantPrincipalId",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.review.listMerchantReviews.field.merchantPrincipalId"
        },
        {
          name: "page",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.review.listMerchantReviews.field.page"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.review.listMerchantReviews.case.listed",
        json: {
          merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d",
          average_rating: 4.33,
          total_reviews: 3,
          data: [
            {
              id: "019a0b4e-6f2d-7c3a-9b1e-4d5f6a7b8c9d",
              product_id: "KOPI-GAYO-250G",
              rating: 5,
              comment: "Kopinya segar, kemasan rapi.",
              created_at: "2026-10-22T03:15:00.000000Z",
              updated_at: "2026-10-22T03:15:00.000000Z",
              merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d"
            },
            {
              id: "0199f8a2-4b5c-7d6e-8f90-a1b2c3d4e5f6",
              product_id: "TEH-HIJAU-100G",
              rating: 4,
              comment: "Aromanya enak.",
              created_at: "2026-10-19T14:05:37.000000Z",
              updated_at: "2026-10-19T14:05:37.000000Z",
              merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d"
            },
            {
              id: "0199f2c1-8d3e-7a4b-b5c6-7d8e9f0a1b2c",
              product_id: "KOPI-GAYO-250G",
              rating: 4,
              comment: null,
              created_at: "2026-10-17T09:42:11.000000Z",
              updated_at: "2026-10-17T09:42:11.000000Z",
              merchant_principal_id: "5b2e8c1d-7a4f-4e6b-8c9d-1f3a5b7c9e2d"
            }
          ],
          current_page: 1,
          last_page: 1
        },
        source: restSource("review", "app/Services/ProductReviewService.php", 66, 79)
      },
      {
        status: 200,
        when: "rest.review.listMerchantReviews.case.none",
        json: {
          merchant_principal_id: "c7e9a1b3-5d2f-4a8c-9e6b-2f4a6c8e0b1d",
          average_rating: 0,
          total_reviews: 0,
          data: [],
          current_page: 1,
          last_page: 1
        },
        source: restSource("review", "app/Repositories/EloquentProductReviewRepository.php", 39, 54)
      }
    ],
    source: restSource("review", "app/Http/Controllers/ProductReviewController.php", 51, 55)
  },
  {
    id: "review.listDriverRatings",
    service: "review",
    method: "GET",
    path: "/api/v1/reviews/drivers/{driverPrincipalId}",
    summary: "rest.review.listDriverRatings.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.review.listDriverRatings.who"
    },
    request: {
      fields: [
        {
          name: "driverPrincipalId",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.review.listDriverRatings.field.driverPrincipalId"
        },
        {
          name: "page",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.review.listDriverRatings.field.page"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.review.listDriverRatings.case.listed",
        json: {
          driver_principal_id: "a3c5e7f9-2b4d-4f6a-8c1e-3d5f7a9b1c2e",
          average_rating: 4,
          total_ratings: 2,
          data: [
            {
              id: "019a0b4f-0a1b-7c2d-8e3f-5a6b7c8d9e0f",
              rating: 4,
              comment: "Kurir ramah dan tepat waktu.",
              created_at: "2026-10-22T03:15:00.000000Z",
              updated_at: "2026-10-22T03:15:00.000000Z",
              driver_principal_id: "a3c5e7f9-2b4d-4f6a-8c1e-3d5f7a9b1c2e"
            },
            {
              id: "0199f5d7-2e3f-7a4b-8c5d-6e7f8a9b0c1d",
              rating: 4,
              comment: null,
              created_at: "2026-10-18T11:20:45.000000Z",
              updated_at: "2026-10-18T11:20:45.000000Z",
              driver_principal_id: "a3c5e7f9-2b4d-4f6a-8c1e-3d5f7a9b1c2e"
            }
          ],
          current_page: 1,
          last_page: 1
        },
        source: restSource("review", "app/Services/DriverRatingService.php", 50, 63)
      },
      {
        status: 200,
        when: "rest.review.listDriverRatings.case.none",
        json: {
          driver_principal_id: "e1f3a5c7-9b2d-4e6f-8a1c-3b5d7f9e2a4c",
          average_rating: 0,
          total_ratings: 0,
          data: [],
          current_page: 1,
          last_page: 1
        },
        source: restSource("review", "app/Repositories/EloquentDriverRatingRepository.php", 22, 37)
      }
    ],
    source: restSource("review", "app/Http/Controllers/DriverRatingController.php", 44, 48)
  }
];
