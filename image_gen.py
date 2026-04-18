# # # #  Starting ..... Tommorrorw-----/ 12-04-2026  at [16:25]
# # # # ===================================
# # # # =======Image gen --- ForgeAi======
# # # # ====================================

# # # import requests
# # # from urllib.parse import quote
# # # import os

# # # def generate_image(prompt: str,width: int= 1024,height: int = 1024)-> str:
# # #     try:
# # #         encoded_prompt = quote(prompt)
# # #         image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&nologo=true"
        
# # #         save_path = f"generated_images/{encoded_prompt}.png"
# # #         os.makedirs("generated_images", exist_ok=True)
        
# # #         print(f"Generating: {prompt}")
# # #         response = requests.get(image_url, timeout=60)

# # #         if response.status_code == 200:
# # #             with open(save_path, "wb") as f:
# # #                 f.write(response.content)
# # #             print(f"Image Saved: {save_path}")
# # #             return save_path
# # #         else:
# # #             return None
    
# # #     except Exception as e:
# # #         print(f"Error: {e}")
# # #         return None

# # # if __name__ == "__main__":
# # #     prompt = input("Enter the prompt: ")
# # #     url = generate_image(prompt)
# # #     if url:
# # #         print(f"\nImage URL:\n{url}")
# # #         print("\nOpen the url in the browser!")
# # #     else:
# # #         print("Sorry, Image generation failes, Pls try again...")

# # from urllib.parse import quote

# # def generate_image(prompt: str, width: int=1024, height: int=1024) -> str:
# #     encoded_prompt = quote(prompt)
# #     image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"
# #     return image_url

# from urllib.parse import quote
# import requests
# import time
# import os

# def generate_image(prompt: str) -> str:
#     try:
#         encoded_prompt = quote(prompt)
        
        
#         image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true&model=flux"
        
#         print(f"🎨 Generating: {prompt}")
        
#         # Verify karo
#         response = requests.get(image_url, timeout=60)
        
#         if response.status_code == 200 and response.headers.get('content-type', '').startswith('image'):
#             # Save karo
#             filename = f"image_{int(time.time())}.png"
#             os.makedirs("generated_images", exist_ok=True)
#             save_path = f"generated_images/{filename}"
            
#             with open(save_path, "wb") as f:
#                 f.write(response.content)
            
#             print(f"✅ Saved: {save_path}")
#             os.startfile(os.path.abspath(save_path))
#             return image_url
#         else:
#             return None
            
#     except Exception as e:
#         print(f"Error: {e}")
#         return None
    
# if __name__ == "__main__":
#     # print(generate_image(prompt ))
#     generate_image

from urllib.parse import quote
import requests
import time
import os

# def generate_image(prompt: str) -> str:
#     try:
#         encoded_prompt = quote(prompt)
#         image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true&model=flux"
        
#         print(f"🎨 Generating: {prompt}")
#         response = requests.get(image_url, timeout=60)
        
#         if response.status_code == 200:
#             # Save locally
#             filename = f"image_{int(time.time())}.png"
#             os.makedirs("generated_images", exist_ok=True)
#             save_path = f"generated_images/{filename}"
            
#             with open(save_path, "wb") as f:
#                 f.write(response.content)
            
#             # Return local URL jo frontend access kar sake
#             return f"https://forgeai-em4m.onrender.com/images/{filename}"
#         else:
#             return None
            
#     except Exception as e:
#         print(f"Error: {e}")
#         return None
def generate_image(prompt: str) -> str:
    try:
        from urllib.parse import quote
        encoded_prompt = quote(prompt)
        
        # Sirf URL return karo — download mat karo!
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&nologo=true&model=flux&seed={int(time.time())}"
        
        print(f"🎨 Image URL ready: {image_url}")
        return image_url
        
    except Exception as e:
        print(f"Error: {e}")
        return None