using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    //private SceneLoader sceneLoader;
    public void Start()
    {
        
        
        GameObject.Find("Audio").SetActive(false);
        GameObject.Find("Settings").SetActive(false);
    }

    public void PlayGame()
    {
        SceneLoader sceneLoader = FindObjectOfType<SceneLoader>();
        if (sceneLoader != null)
        {
            sceneLoader.LoadScene("GameScene");
        }
        else
        {
            Debug.LogError("SceneLoader not found in the scene.");
        }
    }

    public void ExitGame()
    {
        Application.Quit();
    }
}
