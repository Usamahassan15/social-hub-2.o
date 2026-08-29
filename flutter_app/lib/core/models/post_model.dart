import 'package:freezed_annotation/freezed_annotation.dart';

part 'post_model.freezed.dart';
part 'post_model.g.dart';

@freezed
class PostModel with _$PostModel {
  const factory PostModel({
    @JsonKey(name: 'id') required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'content') required String content,
    @JsonKey(name: 'category') String? category,
    @JsonKey(name: 'media_url') String? mediaUrl,
    @JsonKey(name: 'media_type') String? mediaType,
    @JsonKey(name: 'is_anonymous') @Default(false) bool isAnonymous,
    @JsonKey(name: 'is_featured') @Default(false) bool isFeatured,
    @JsonKey(name: 'is_trending') @Default(false) bool isTrending,
    @JsonKey(name: 'likes_count') @Default(0) int likesCount,
    @JsonKey(name: 'comments_count') @Default(0) int commentsCount,
    @JsonKey(name: 'shares_count') @Default(0) int sharesCount,
    @JsonKey(name: 'saves_count') @Default(0) int savesCount,
    @JsonKey(name: 'views_count') @Default(0) int viewsCount,
    @JsonKey(name: 'engagement_rate') double? engagementRate,
    @JsonKey(name: 'quality_score') double? qualityScore,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
    // Joined profile data
    @JsonKey(includeFromJson: false, includeToJson: false) String? username,
    @JsonKey(includeFromJson: false, includeToJson: false) String? avatarUrl,
  }) = _PostModel;

  factory PostModel.fromJson(Map<String, dynamic> json) => _$PostModelFromJson(json);
}
