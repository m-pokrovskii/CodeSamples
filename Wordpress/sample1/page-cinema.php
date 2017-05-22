<?php
/**
	* Template Name: Cinema
	*/
?>
<?php get_header(); ?>
	<div class="cinema-content">
			<div class="cb-module-header wrap cb-wrap-pad cb-category-header">
				<div class="cinema-content__title-wrap">
					<h1 class="cb-module-title"><?php the_title(); ?></h1>
				</div>
			</div>
			<div class="Cinema">
				<div class="WrapVideoSlider">
					<div class="VideoSlider VideoSlider--slick">
						<?php $videos = get_field('cinema_video_slider', $post->ID); ?>
							<?php while( has_sub_field('cinema_video_slider') ): ?>
							<?php 
								$video = get_sub_field('video', false); 
								$q = parse_url($video, PHP_URL_QUERY);
								parse_str($q, $v_pieces);
								$v_id = $v_pieces['v'];
								$description = get_sub_field('description'); 
							?>
							<div class="VideoSlider__item">
								<div class="VideoSlider__iframe">
									<?php echo pb_get_video_oembed( $video, false, false, array(
										  'youtube' => array(
											  'enablejsapi' => '1',
											  'showinfo' => '0',
											  'rel' => '0'
										  ),
										  'youtu.be' => array(
											  'enablejsapi' => '1',
											  'showinfo' => '0',
											  'rel' => '0'
										  )
									)) ?>
								</div>
								<div class="VideoSlider__description">
									<div class="VideoSlider__descriptionContent">
										<?php echo $description ?>
									</div>
								</div>
							</div>
						<?php endwhile; ?>
					</div>
					<div class="VideoSlider__prevSlide"></div>
					<div class="VideoSlider__nextSlide"></div>					
				</div>
				<div id="cb-content" class="wrap clearfix">
					<div class="cb-post-wrap cb-wrap-pad wrap clearfix<?php echo esc_attr( cb_get_post_sidebar_position() ); ?>">
						<div class="Cinema__postsList">
							<?php $post_ids = get_field('cinema_video_posts', false, false); ?>
							<?php
								$posts_per_page = 6;
								$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
								$video_posts = new WP_Query(array(
									'posts_per_page' => $posts_per_page,
									'post_type'      => 'post',
									'post__in'       => $post_ids,
									'post_status'    => 'publish',
									'orderby'        => 'post__in',
									'paged'          => $paged
								));
							 ?>
							<?php 
								if ( $video_posts->have_posts() ) : 
									while ( $video_posts->have_posts() ) : 
									$video_posts->the_post(); 
							?>
							<?php 
								$title = $post->post_title;
								$content = wp_trim_words( $post->post_content, 55, '...' );
								$thumb = get_the_post_thumbnail_url( $post->ID, '378x299' );
								$permalink = get_permalink( $post->ID );
								$cinemaVideoMeta = get_post_meta( $post->ID, '_cinemaVideo', true ); 
								$videoDuration = ( !empty( $cinemaVideoMeta ) ) ? $cinemaVideoMeta['duration'] : "0:00";
								?>
							<div class="Cinema__post">
								<a href="<?php echo $permalink ?>" class="Cinema__postImage" style="background: url(<?php echo $thumb ?>) no-repeat; background-size: cover">
									<div class="Cinema_imageCover">
										<span class="Cinema__postTitle"><?php echo $title; ?></span>
										<div class="Cinema__postVideoDuration"><?php echo $videoDuration ?></div>
									</div>
								</a>
								<div class="Cinema__postContent">
									<?php echo $content; ?>
									<a class="Cinema__watchNowLink" href="<?php echo $permalink; ?>">Watch Now</a>
								</div>
							</div>
							<?php endwhile; ?>
								<?php wp_reset_postdata(); ?>
							<?php endif; ?>
						</div>
						<?php if ( $video_posts->found_posts > $posts_per_page): ?>
							<div class="Cinema__loadMore">
								<button 
									data-next-posts-link="<?php echo next_posts( $video_posts->max_num_pages ); ?>" 
									class="btn btn-theme-cinema-load-more">
									<div class="btn-theme-cinema-load-more__loading">
										<div class="btn-theme-cinema-load-more__svg-wrapper">
											<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
												<rect x="0" y="6.94444" width="4" height="16.1111" fill="#333" opacity="0.2">
													<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
													<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
													<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
												</rect>
												<rect x="8" y="9.44444" width="4" height="11.1111" fill="#333" opacity="0.2">
													<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
													<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
													<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
												</rect>
												<rect x="16" y="8.05556" width="4" height="13.8889" fill="#333" opacity="0.2">
													<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
													<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
													<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
												</rect>
											</svg>
										</div>							
									</div>
									<span class="btn-theme-cinema-load-more__text">Load More</span>
								</button>
							</div>
						<?php endif ?>
					</div>
				</div>
			</div>
	</div>
<?php get_footer(); ?>